import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

let attemptedOptions = 0;

function QuizComponent() {
  const location = useLocation();
  const [categoryData, setCategoryData] = useState([]);
  const testId = location.state?.testId;
  const [correctanswers, setcorrectanswers] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [time, setTimer] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [questions, setQuestions] = useState([
    {
      category: " ",
      question: " ",
      options: [
        { label: " ", text: " " },
        { label: " ", text: " " },
        { label: " ", text: " " },
        { label: " ", text: " " },
      ],
    },
  ]);

  useEffect(() => {
    const getTestData = async () => {
      try {
        if (loading) return;
        if (!user) return;
        if (error) console.log(error);

        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc1 = await getDocs(q);
        const data = doc1.docs[0].data();
        const docRef = doc(db, "tests", data.exam);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetched = docSnap.data();
          setQuestions(fetched[testId].question);
          setcorrectanswers(
            fetched[testId].question.map((q) => q.correctanswer)
          );
          setTimer(parseInt(fetched[testId].time));
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error(err);
      }
    };

    getTestData();
    const cleanup = startTimer();
    return cleanup;
    // eslint-disable-next-line
  }, [user, loading, error, testId, time]);

  const navigate = useNavigate();
  const [pro, setPro] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [startTime, setStartTime] = useState(Date.now());
  const [Score, setScore] = useState(0);
  const [Percentage, setPercentage] = useState(0);
  const [categoryAnswers, setCategoryWiseAnswers] = useState({});
  const [timeTaken, setTimeTaken] = useState(Array(questions.length).fill(0));

  const checkAnswers = () => {
    const results = answers.map(
      (answer, index) => answer === correctanswers[index]
    );

    const categoryTimes = {};

    questions.forEach((question, index) => {
      const category = question.category;
      if (!categoryTimes[category]) {
        categoryTimes[category] = {
          totalTime: 0,
          count: 0,
          correct: 0,
          totalCorrectTime: 0,
        };
      }
      categoryTimes[category].totalTime += timeTaken[index];
      categoryTimes[category].count += 1;
      if (results[index]) {
        categoryTimes[category].correct += 1;
        categoryTimes[category].totalCorrectTime += timeTaken[index];
      }
    });

    const averageTimes = Object.keys(categoryTimes).map((category) => {
      const avgTime = (
        categoryTimes[category].totalTime / categoryTimes[category].count
      ).toFixed(2);
      const avgCorrectTime = (
        categoryTimes[category].totalCorrectTime /
        categoryTimes[category].correct
      ).toFixed(2);

      // Attention required is a combination of correctness and average time taken
      const correctnessFactor =
        100 -
        (categoryTimes[category].correct / categoryTimes[category].count) * 100;

      const avgTimeFactor = avgCorrectTime / avgTime;

      const attentionRequired = (correctnessFactor * avgTimeFactor).toFixed(2);

      return { category, avgTime, avgCorrectTime, attentionRequired };
    });

    return averageTimes;
  };

  const handleOptionClick = (option) => {
    const endTime = Date.now();
    const timeForQuestion = (endTime - startTime) / 1000; // time in seconds
    setTimeTaken((prevTimeTaken) => {
      const updatedTime = [...prevTimeTaken];
      updatedTime[currentQuestionIndex] = timeForQuestion;
      return updatedTime;
    });
    setStartTime(endTime); // reset start time for next question
    setSelectedOption(option);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = option.label;
    setAnswers(updatedAnswers);
    if (selectedOption === null) {
      setPro((prevPro) => prevPro + (1 / questions.length) * 100);
      attemptedOptions++;
    }
  };

  const handleNextClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const lastSelectedOption = answers[currentQuestionIndex + 1];
      if (lastSelectedOption) {
        setSelectedOption({ label: lastSelectedOption });
      } else {
        setSelectedOption(null);
      }
    } else {
      console.log("All questions completed");
      handleTestCompletion();
      updateTest();
      setTestCompleted(true);
    }
  };

  const updateTest = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc1 = await getDocs(q);
      const data = doc1.docs[0].data();
      const usersCollectionRef = collection(db, "users");
      const userDocQuery = await getDocs(
        query(usersCollectionRef, where("uid", "==", user?.uid))
      );

      if (!userDocQuery.empty) {
        const userDocRef = userDocQuery.docs[0].ref;

        // Update the existing document with the selected exam
        await updateDoc(userDocRef, {
          userdata: { CurrentTest: data.userdata.CurrentTest + 1 },
        });
        console.log("User profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handlePreviousClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const lastSelectedOption = answers[currentQuestionIndex - 1];
      if (lastSelectedOption) {
        setSelectedOption({ label: lastSelectedOption });
      }
    }
  };

  const handleTestCompletion = () => {
    const results = answers.map(
      (answer, index) => answer === correctanswers[index]
    );
    const categoryWiseAnswers = {};
    const averageTimes = checkAnswers();
    setCategoryData(averageTimes); // Update categoryData state
    const score = results.filter((result) => result).length; // Count the number of correct answers
    setScore(score);
    const totalQuestions = results.length; // Total number of questions

    // Iterate through questions and update categoryWiseAnswers
    questions.forEach((question, index) => {
      const category = question.category;
      const isCorrect = results[index];

      if (!categoryWiseAnswers[category]) {
        categoryWiseAnswers[category] = {
          correct: 0,
          total: 0,
        };
      }

      categoryWiseAnswers[category].total++;
      if (isCorrect) {
        categoryWiseAnswers[category].correct++;
      }
      setCategoryWiseAnswers(categoryWiseAnswers);
    });

    // Log category-wise correct and total answers
    Object.entries(categoryWiseAnswers).forEach(
      ([category, { correct, total }]) => {
        console.log(`${category}: ${correct}/${total}`);
      }
    );

    console.log(`Score: ${score}/${totalQuestions}`); // Print the score

    // Optionally, you can also calculate and print the percentage of correct answers
    const percentage = (score / totalQuestions) * 100;
    setPercentage(percentage.toFixed(2));
    console.log(`Percentage: ${percentage.toFixed(2)}%`);
    console.log(
      "Average time per question:",
      (timeTaken.reduce((a, b) => a + b) / questions.length).toFixed(2)
    );
    console.log("Detailed Results:", averageTimes);
  };

  const isOptionSelected = (option) => {
    return selectedOption?.label === option.label;
  };

  const isContinueDisabled = selectedOption === null;

  function startTimer() {
    let timeLimit = time * 60; // Convert time in minutes to seconds
    let timer;

    const timerElement = document.getElementById("timer");
    if (timerElement) {
      const startTimer = () => {
        timer = setInterval(() => {
          const minutes = Math.floor(timeLimit / 60);
          const seconds = timeLimit % 60;

          timerElement.textContent = `🕜 ${minutes}:${
            seconds < 10 ? "0" : ""
          }${seconds}`;

          if (timeLimit <= 0) {
            clearInterval(timer);
            alert("Time's up!");
          }

          timeLimit--;
        }, 1000);
      };

      startTimer();
    }

    return () => {
      clearInterval(timer);
    };
  }

  const data = {
    labels: categoryData.map((d) => d.category),
    datasets: [
      {
        label: "Attention Needed",
        data: categoryData.map((d) => d.attentionRequired),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Average Time",
        data: categoryData.map((d) => d.avgTime),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Warning Setups

  //====================================================================================================================

  return testCompleted ? (
    <Block>
      <Circle
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc1353b406cdc5577bcbd645528cc7cc9e348b0c8058cb65d083795bdd79ab29?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
        alt="First image"
      />
      <Cube
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e8afa8948546c2c3fbfc70dd781a98cc5945478848c882ac206981811937afcc?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
        alt="Second image"
      />
      <Header>
        <TimeBox>Time Taken: 20:00</TimeBox>
        <SubHeader>Assessment Test 1</SubHeader>
        <FinishButton onClick={() => navigate("/dashboard")}>
          Finish
        </FinishButton>
      </Header>
      <FlexContainer>
        <Column>
          <Graph>
            <h3>Detailed Report</h3>
            <Bar data={data} options={options} />
            <LogsContainer>
              <h3>Logs</h3>
              {Object.entries(categoryAnswers).map(
                ([category, { correct, total }]) => (
                  <LogItem key={category}>
                    <CategoryName>{category}:</CategoryName>
                    <CorrectTotal>
                      {correct}/{total}
                    </CorrectTotal>
                  </LogItem>
                )
              )}
              <LogItem>
                <CategoryName>Score:</CategoryName>
                <CorrectTotal>
                  {Score}/{questions.length}
                </CorrectTotal>
              </LogItem>
              <LogItem>
                <CategoryName>Percentage:</CategoryName>
                <CorrectTotal>{Percentage}%</CorrectTotal>
              </LogItem>
              <LogItem>
                <CategoryName>Average time per question:</CategoryName>
                <CorrectTotal>
                  {(
                    timeTaken.reduce((a, b) => a + b) / questions.length
                  ).toFixed(2)}{" "}
                  seconds
                </CorrectTotal>
              </LogItem>
            </LogsContainer>
          </Graph>
        </Column>
        <Column>
          <InfoContainer>
            <Icon
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f152390cbe0d2ad633c12d505aacd702899e0f237261f85333c087de07db5aef?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
              alt="Info Icon"
              onClick={() => {
                currentQuestionIndex > 0
                  ? setCurrentQuestionIndex(currentQuestionIndex - 1)
                  : setCurrentQuestionIndex(questions.length - 1);
              }}
            />
            <QuizSection1>
              <QuizPrompt>
                {questions[currentQuestionIndex].question}
              </QuizPrompt>
              {questions[currentQuestionIndex].options.map(
                (option, optIndex) => {
                  const isCorrect =
                    option.label === correctanswers[currentQuestionIndex];
                  const isSelected =
                    option.label === answers[currentQuestionIndex];
                  return (
                    <Option
                      key={optIndex}
                      style={{
                        backgroundColor: isCorrect
                          ? "#64FF96"
                          : isSelected
                          ? "#FF9292"
                          : "rgba(166, 154, 255, 0.59)",
                        borderColor: isCorrect
                          ? "green"
                          : isSelected
                          ? "red"
                          : "blue",
                      }}
                    >
                      {option.label}: {option.text}
                    </Option>
                  );
                }
              )}
            </QuizSection1>
            <Icon
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cbda51264997c38a4918cc5d8019469234affea2b398cf5c8800fd9205f3f25a?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
              alt="Info Icon"
              onClick={() => {
                currentQuestionIndex < questions.length - 1
                  ? setCurrentQuestionIndex(currentQuestionIndex + 1)
                  : setCurrentQuestionIndex(0);
              }}
            />
          </InfoContainer>
        </Column>
      </FlexContainer>
    </Block>
  ) : (
    <MainContainer>
      <Circle
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc1353b406cdc5577bcbd645528cc7cc9e348b0c8058cb65d083795bdd79ab29?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
        alt="First image"
      />
      <Cube
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e8afa8948546c2c3fbfc70dd781a98cc5945478848c882ac206981811937afcc?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
        alt="Second image"
      />
      <MainSection>
        <Header>
          <Timer id="timer">🕜 </Timer>
          <SubHeader>Test</SubHeader>
          <Exitbtn onClick={() => navigate("/dashboard")}>X</Exitbtn>
        </Header>
        <QuizSection>
          <QuizPrompt>{questions[currentQuestionIndex].question}</QuizPrompt>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <Option
              key={index}
              className={isOptionSelected(option) ? "selected" : ""}
              onClick={() => handleOptionClick(option)}
            >
              <OptionLabel>{option.label}</OptionLabel>
              <OptionText>{option.text}</OptionText>
            </Option>
          ))}
        </QuizSection>
        <Navigation>
          <NavButton
            onClick={handlePreviousClick}
            className={currentQuestionIndex === 0 ? "disabled" : "enabled"}
          >
            {"PREVIOUS"}
          </NavButton>
          <ProgressHolder>
            <Wrapper>
              <Progress progress={pro}></Progress>
            </Wrapper>
            <Progresstext>
              {attemptedOptions}/{questions.length}
            </Progresstext>
          </ProgressHolder>
          <NavButton
            onClick={handleNextClick}
            disabled={isContinueDisabled}
            className={isContinueDisabled ? "disabled" : "enabled"}
          >
            {currentQuestionIndex < questions.length - 1 ? "NEXT" : "FINISH"}
          </NavButton>
        </Navigation>
      </MainSection>
    </MainContainer>
  );
}

const LogsContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
`;

const LogItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const CategoryName = styled.span`
  font-weight: bold;
`;

const CorrectTotal = styled.span``;

const Block = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`;

const Graph = styled.div`
  z-index: 3;
  padding: 20px;
  background-color: #fffe;
  margin: 20px;
  border-radius: 20px;
`;

const Icon = styled.img`
  aspect-ratio: 0.61;
  object-fit: auto;
  object-position: center;
  width: 14px;
  margin: auto 0;
  cursor: pointer;
`;

const InfoContainer = styled.section`
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
  position: relative;
  min-height: 730px;
  align-self: stretch;
  color: #060710;
  margin: auto 0;
  padding: 31px 38px 17px 18px;

  @media (max-width: 991px) {
    margin-top: 40px;
    flex-wrap: wrap;
    padding-right: 20px;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 100px;
  @media (max-width: 991px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 57%;

  @media (max-width: 991px) {
    width: 100%;
  }
`;

const FinishButton = styled.button`
  border-radius: 6px;
  background-color: rgba(106, 90, 224, 1);
  color: #fff;
  z-index: 1;
  white-space: nowrap;
  justify-content: center;
  padding: 14px 41px;
  font-size: 22px;
  font-family: Quattrocento Sans, -apple-system, Roboto, Helvetica, sans-serif;

  @media (max-width: 991px) {
    white-space: initial;
    padding: 0 20px;
  }
`;

const TimeBox = styled.time`
  display: flex;
  justify-content: center;
  border-radius: 10px;
  border: 2px solid rgba(239, 238, 252, 1);
  background-color: #fff;
  color: #0c092a;
  padding: 8px 12px;
  font: 500 16px/1.5 Rubik, sans-serif;
`;

const ProgressHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Progresstext = styled.span`
  font-familiy: "Poppins";
  font-size: 18px;
  padding: 0 10px;
`;

const Wrapper = styled.div`
  width: 200px;
  height: 15px;
  background-color: lightgrey;
  border-radius: 7px;
`;

const Progress = styled.div`
  height: 15px;
  border-radius: 7px;
  background-color: #00c940;
  border-color: white;
  border-width: 2px;
  width: ${(props) => `${props.progress}%`};
`;

const Circle = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 40%;
  position: absolute;
  right: 0;
  top: 0;
  max-width: 480px;
  align-self: flex-end;
`;

const Cube = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 40%;
  max-width: 480px;
  margin-top: auto;
  left: 0;
  bottom: 0;
  align-self: flex-start;
  position: absolute;
`;

const MainContainer = styled.div`
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  background-color: #cdc9f3;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const MainSection = styled.div`
  display: flex;
  z-index: 1;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: space-around;
`;

const Header = styled.header`
  z-index: 5;
  position: fixed;
  top: 0;
  display: flex;
  flex-direction: row;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(223, 219, 233, 1);
  justify-content: space-around;
  font-family: "Quantico", sans-serif;
  gap: 20px;
  width: 100%;
  align-items: center;
`;

const Timer = styled.h2`
  background-color: #8475ef;
  color: #fff;
  padding: 11px 18px;
  border-radius: 6px;
  font-size: 18px;
  line-height: 1;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
    font-size: 14px;
  }
`;

const SubHeader = styled.h1`
  color: #060710;
  font-size: 32px;
  font-family: Hina Mincho, sans-serif;
  line-height: 0.75;
  @media (max-width: 991px) {
    font-size: 22px;
  }
`;

const Exitbtn = styled.div`
  background-color: #8475ef;
  color: #fff;
  margin-left: 40px;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 22px;
  cursor: pointer;

  @media (max-width: 991px) {
    white-space: initial;
    font-size: 20px;
  }
`;

const QuizSection = styled.div`
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(223, 219, 233, 1);
  border-radius: 40px 40px 0 0;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 68px;
  margin-top: 100px;
  padding: 40px;
  width: 70%;
  max-width: 768px;
  height: 80vh;
  max-width: 1440px;
  font-weight: 700;
  color: #060710;
  font-family: "Quattrocento", sans-serif;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;

const QuizSection1 = styled.div`
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(223, 219, 233, 1);
  border-radius: 40px;
  backdrop-filter: blur(15px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  width: 70%;
  max-width: 768px;
  height: 70%;
  font-weight: 700;
  color: #060710;
  font-family: "Quattrocento", sans-serif;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;

const QuizPrompt = styled.p`
  font-size: 20px;
  line-height: 1.46;
  text-align: justify;
  @media (max-width: 991px) {
    max-width: 100%;
    font-size: 16px;
  }
`;

const Option = styled.div`
  display: flex;
  gap: 20px;
  background: rgba(166, 154, 255, 0.59);
  border-radius: 8px;
  padding: 16px 24px;
  margin-top: 30px;
  width: 90%;
  cursor: pointer;
  &:hover {
    border-color: #fff;
  }
  &.selected {
    border: 2px solid blue;
  }
  @media (max-width: 991px) {
    flex-wrap: wrap;
    padding: 10px;
  }
`;

const OptionLabel = styled.div`
  background: #8f80ff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 16px;

  @media (max-width: 991px) {
    white-space: initial;
    font-size: 14px;
  }
`;

const OptionText = styled.div`
  flex-grow: 1;
  font-size: 16px;
  line-height: 1.35;
  margin: auto 0;
  @media (max-width: 991px) {
    white-space: initial;
    font-size: 14px;
  }
`;

const Navigation = styled.nav`
  background-color: rgba(144, 135, 229, 0.8);
  display: flex;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
`;

const NavButton = styled.button`
  padding: 25px 60px;
  border-radius: 8px;
  font-family: "Abhaya Libre", sans-serif;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 20px 40px;
    white-space: initial;
  }
  &:first-child {
    background: #432af8;
    color: #ede8e2;
    border: 1px solid #cdcbf3;
  }
  &:last-child {
    background: #747475;
    color: #ede8e2;
    border: none;
  }
  &.disabled {
    background: grey;
    pointer-events: none;
  }
  &.enabled {
    background: #432af8;
    pointer-events: auto;
  }
`;

export default QuizComponent;
