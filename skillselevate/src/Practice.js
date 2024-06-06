// eslint-disable-line react-hooks/exhaustive-deps
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = `${process.env.REACT_APP_GEN_AI_API_KEY}`;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const categories = [
  "Logical Reasoning",
  "Mathematical Aptitude",
  "General Knowledge",
  "Verbal Ability",
];

function QuizComponent() {
  const componentMounted = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  useEffect(() => {
    if (!componentMounted.current) {
      componentMounted.current = true;
    } else {
      fetchNewQuestion();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOptionClick = useCallback(
    (option) => {
      setSelectedOption(option);
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = option.label;
      setAnswers(updatedAnswers);
      setShowExplanation(true);

      const isCorrect = option.label === currentQuestion.correctAnswer;
      if (isCorrect) {
        const nextCategoryIndex = categories.indexOf(currentCategory) + 1;
        setCurrentCategory(
          nextCategoryIndex < categories.length
            ? categories[nextCategoryIndex]
            : categories[0]
        );
      }
    },
    [answers, currentQuestionIndex, currentQuestion, currentCategory]
  );

  const handleContinueClick = useCallback(async () => {
    setSelectedOption(null);
    await fetchNewQuestion();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOptionSelected = useCallback(
    (option) => selectedOption?.label === option.label,
    [selectedOption]
  );

  const isCorrectAnswer = useCallback(
    (option) => option.label === currentQuestion?.correctAnswer,
    [currentQuestion]
  );

  const getOptionStyle = useCallback(
    (option) => {
      if (showExplanation) {
        if (isCorrectAnswer(option)) {
          return { backgroundColor: "#64FF96" };
        } else if (isOptionSelected(option)) {
          return { backgroundColor: "#FF9292" };
        }
      }
      return {};
    },
    [showExplanation, isCorrectAnswer, isOptionSelected]
  );

  const fetchNewQuestion = useCallback(async () => {
    setIsLoading(true);
    const prompt = `Generate a multiple-choice question in the category of ${currentCategory} for students of standard 8th onwards. Provide the response in the following Format, don't respond anything else:
    
    Question: [Full question text within 40 words]
    A. [First option]
    B. [Second option]
    C. [Third option]
    D. [Fourth option]
    Correct Answer: [A, B, C, or D]
    Explanation: [Explanation with in 100 words]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    const newQuestion = parseGeneratedQuestion(text);
    setCurrentQuestion(newQuestion);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowExplanation(false);
    setIsLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

  const parseGeneratedQuestion = useCallback(
    (text) => {
      const lines = text.trim().split("\n");
      const prompt = lines[0].replace("Question: ", "");
      const options = [
        { label: "A", text: lines[1].replace("A. ", "") },
        { label: "B", text: lines[2].replace("B. ", "") },
        { label: "C", text: lines[3].replace("C. ", "") },
        { label: "D", text: lines[4].replace("D. ", "") },
      ];
      const correctAnswer = lines[5].replace("Correct Answer: ", "");
      const explanation = lines[6].replace("Explanation: ", "");

      return {
        id: currentQuestionIndex + 1,
        prompt,
        options,
        correctAnswer,
        explanation,
      };
    },
    [currentQuestionIndex]
  );

  const isContinueDisabled = !selectedOption;

  // Call fetchNewQuestion only on the initial render
  if (!componentMounted.current) {
    componentMounted.current = true;
    fetchNewQuestion();
  }

  return (
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
      {isLoading && (
        <Loader>
          <CircularProgress />
        </Loader>
      )}
      <MainSection>
        <Header>
          <StreakHeader>Streak</StreakHeader>
          <SubHeader>Practice Skills</SubHeader>
          <ExitButton>X</ExitButton>
        </Header>
        <QuizSection>
          <QuizPrompt>{currentQuestion?.prompt}</QuizPrompt>
          {currentQuestion?.options.map((option, index) => (
            <Option
              key={index}
              className={isOptionSelected(option) ? "selected" : ""}
              onClick={() => handleOptionClick(option)}
              style={getOptionStyle(option)}
            >
              <Options>
                <OptionLabel>{option.label}</OptionLabel>
                <OptionText>{option.text}</OptionText>
              </Options>
              {showExplanation && isCorrectAnswer(option) && (
                <ExplanationBox>
                  <h3>Explanation:</h3>
                  <p>{currentQuestion.explanation}</p>
                </ExplanationBox>
              )}
            </Option>
          ))}
        </QuizSection>
        <Navigation>
          <NavButton
            onClick={handleContinueClick}
            disabled={isContinueDisabled}
            className={isContinueDisabled ? "disabled" : "enabled"}
          >
            CONTINUE
          </NavButton>
        </Navigation>
      </MainSection>
    </MainContainer>
  );
}
const Loader = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  position: fixed;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  top: 0;
  z-index: 3;
`;

const Options = styled.div`
  display: flex;
  flex-dirextion: row;
  gap: 20px;
  flex-wrap: wrap;
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(166, 154, 255, 0.59);
  border-radius: 8px;
  padding: 16px 24px;
  margin-top: 30px;
  width: 90%;
  cursor: pointer;
  transition: all 0.3s ease;
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
  &:last-child {
    margin-bottom: 10%;
  }
`;

const ExplanationBox = styled.div`
  h3 {
    color: #432af8;
    margin-bottom: 10px;
  }
  p {
    color: #333;
    line-height: 1.6;
  }
  @media (max-width: 991px) {
    white-space: initial;
    font-size: 14px;
  }
`;

const Circle = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 40%;
  position: fixed;
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
  position: fixed;
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

const StreakHeader = styled.h2`
  background-color: #8475ef;
  color: #fff;
  padding: 11px 18px;
  border-radius: 6px;
  font-size: 22px;
  line-height: 1;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
    font-size: 15px;
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

const ExitButton = styled.div`
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
  &.disabled {
    background: grey;
    pointer-events: none;
  }
  &.enabled {
    background: #432af8;
    color: white;
    pointer-events: auto;
  }
`;

export default QuizComponent;
