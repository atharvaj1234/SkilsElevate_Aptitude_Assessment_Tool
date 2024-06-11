import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import AssesmentTest from "./Assesment";


let attemptedOptions = 0;

function QuizComponent() {
  const location = useLocation();
  const testId = location.state?.testId || null;
  const componentMounted = useRef(false);
  const [correctanswers, setcorrectanswers] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const [time , setTimer] = useState(0)
  const [testCompleted , setTestCompleted] = useState(false);
  const [questions, setQuestions] = useState([ {
        category: " ",
        question: " ",
        options: [
          { label: " ", text: " " },
          { label: " ", text: " " },
          { label: " ", text: " " },
          { label: " ", text: " " },
        ],
      },]);

  useEffect(() => {
    if (!componentMounted.current) {
      componentMounted.current = true;
    } else {
    if (loading) return;
    if (!user) return navigate("/");
    if (error) console.log(error);
    getdata();
    const cleanup = startTimer();
    return cleanup;
    }
    // eslint-disable-next-line
  }, [time]);

  const getdata = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc1 = await getDocs(q);
      const data = doc1.docs[0].data();
      const docRef = doc(db, "tests", data.exam);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        let fetched = docSnap.data();

        setQuestions(fetched[testId].question)
        setcorrectanswers(fetched[testId].question.map(q => q.correctanswer));
        setTimer(parseInt(fetched[testId].time))
        console.log(fetched[testId].question)
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();
  const [pro, setPro] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [startTime, setStartTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(Array(questions.length).fill(0));

  const checkAnswers = () => {
    const results = answers.map(
      (answer, index) => answer === correctanswers[index]
    );
  
    const categoryTimes = {};
  
    questions.forEach((question, index) => {
      const category = question.category;
      if (!categoryTimes[category]) {
        categoryTimes[category] = { totalTime: 0, count: 0, correct: 0, totalCorrectTime: 0 };
      }
      categoryTimes[category].totalTime += timeTaken[index];
      categoryTimes[category].count += 1;
      if (results[index]) {
        categoryTimes[category].correct += 1;
        categoryTimes[category].totalCorrectTime += timeTaken[index];
      }
    });
  
    const averageTimes = Object.keys(categoryTimes).map((category) => {
      const avgTime =
        (categoryTimes[category].totalTime / categoryTimes[category].count).toFixed(2);
      const avgCorrectTime =
        (categoryTimes[category].totalCorrectTime / categoryTimes[category].correct).toFixed(2);
  
      // Attention required is a combination of correctness and average time taken
      const correctnessFactor =
        100 - (categoryTimes[category].correct / categoryTimes[category].count) * 100;
      
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
    setPro((prevPro) => prevPro + (1 / questions.length) * 100);
    attemptedOptions++;
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
        navigate("/Assesment", { state: { testId: testId } })
      
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
    const averageTimes = checkAnswers();
    const score = results.filter(result => result).length; // Count the number of correct answers
  const totalQuestions = results.length; // Total number of questions

  console.log(`Score: ${score}/${totalQuestions}`); // Print the score

  // Optionally, you can also calculate and print the percentage of correct answers
  const percentage = (score / totalQuestions) * 100;
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
  
          timerElement.textContent = `🕜 ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  
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

  // Warning Setups

  //====================================================================================================================

  return (<MainContainer>
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
  margin-top: 20px;
  display: flex;
  flex-direction: row;
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
  margin-top: 50px;
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

