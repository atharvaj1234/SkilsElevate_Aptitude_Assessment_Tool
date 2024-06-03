import React, { useState } from 'react';
import styled from "styled-components";

const questions = [
  {
    id: 1,
    prompt: "Q1. PREDICT THE TOP LOSER (for tomorrow) across these indices",
    options: [
      { label: "A", text: "Option 1" },
      { label: "B", text: "Option 2" },
      { label: "C", text: "Option 3" },
      { label: "D", text: "Option 4" },
    ],
  },
  {
    id: 2,
    prompt: "Q2. PREDICT THE TOP LOSER (for tomorrow) across these indices",
    options: [
      { label: "A", text: "Option 1" },
      { label: "B", text: "Option 2" },
      { label: "C", text: "Option 3" },
      { label: "D", text: "Option 4" },
    ],
  },
  {
    id: 3,
    prompt: "Q3. PREDICT THE TOP LOSER (for tomorrow) across these indices",
    options: [
      { label: "A", text: "Option 1" },
      { label: "B", text: "Option 2" },
      { label: "C", text: "Option 3" },
      { label: "D", text: "Option 4" },
    ],
  },
];


function QuizComponent() {
  const [pro, setPro] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [answers, setAnswers] = React.useState(Array(questions.length).fill(null));

  const correctAnswers = ['A', 'B', 'C']; // Example correct answers

  const checkAnswers = () => {
    const results = answers.map((answer, index) => answer === correctAnswers[index]);
    console.log(results); // Output: [true, false, true], etc.
  };


  const handleOptionClick = (option) => {
    setSelectedOption(option);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = option.label;
    setAnswers(updatedAnswers);
  };

  const handleContinueClick = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selection for the next question
      setPro((prevPro) => prevPro + (1 / (questions.length))*100); 
    } else {
      console.log("All questions completed");
      checkAnswers();
    }
  };

  const isOptionSelected = (option) => {
    return selectedOption?.label === option.label;
  };

  const isContinueDisabled = selectedOption === null;

  return (
    <MainContainer>
      <Circle loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/fc1353b406cdc5577bcbd645528cc7cc9e348b0c8058cb65d083795bdd79ab29?apiKey=9fbb9e9d71d845eab2e7b2195d716278&" alt="First image" />
      <Cube loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/e8afa8948546c2c3fbfc70dd781a98cc5945478848c882ac206981811937afcc?apiKey=9fbb9e9d71d845eab2e7b2195d716278&" alt="Second image" />
      <MainSection>
        <Header>
          <StreakHeader>Streak</StreakHeader>
          <SubHeader>Practice Skills</SubHeader>
          <Exitbtn>X</Exitbtn>
        </Header>
        <QuizSection>
          <QuizPrompt>
            {questions[currentQuestionIndex].prompt}
          </QuizPrompt>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <Option 
              key={index} 
              className={isOptionSelected(option)? 'selected' : ''}
              onClick={() => handleOptionClick(option)}
            >
              <OptionLabel>{option.label}</OptionLabel>
              <OptionText>{option.text}</OptionText>
            </Option>
          ))}
        </QuizSection>
        <Navigation>
          <ProgressHolder>
          <Wrapper>
            <Progress progress={pro}></Progress>
          </Wrapper>
          <Progresstext>{currentQuestionIndex}/{questions.length}</Progresstext>
          </ProgressHolder>
          <NavButton 
            onClick={handleContinueClick} 
            disabled={isContinueDisabled}
            className={isContinueDisabled ? 'disabled' : 'enabled'}
          >
            {currentQuestionIndex < questions.length - 1 ? 'NEXT' : 'FINISH'}
          </NavButton>
        </Navigation>
      </MainSection>
    </MainContainer>
  );
}


const ProgressHolder = styled.div`
display: flex;
flex-direction: row;
align-items:center;
`;

const Progresstext = styled.span`
font-familiy: 'Poppins';
font-size: 18px;
padding: 0 10px;
`;

const Wrapper = styled.div`
width: 200px;
height: 15px;
background-color:lightgrey;
border-radius: 7px;
`;

const Progress = styled.div`
height: 15px;
border-radius: 7px;
background-color: #00C940;
border-color: white;
border-width:2px;
width: ${(props) => `${props.progress}%`}
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
  z-index:1;
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
    border-color:#fff;
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
    background: #432AF8;
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
    background: #432AF8;
    pointer-events: auto;
  }
`;

export default QuizComponent;
