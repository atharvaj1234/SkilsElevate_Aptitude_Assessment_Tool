import React, { useState } from "react";
import styled from "styled-components";
import AccountDrop from "./AccountDrop";
import { useAuth } from "./AuthContext";

function TestInfo({
  title,
  difficulty,
  questions,
  time,
  imageSrc,
  status,
  buttonLabel,
}) {
  return (
    <SectionCard>
      <InfoContent>
        <InfoDetails>
          <Title>{title}</Title>
          <Break />
          <DetailText>Difficulty level: {difficulty}</DetailText>
          <DetailText>No. of questions: {questions}</DetailText>
          <DetailText>Time: {time}</DetailText>
        </InfoDetails>
        {status === "locked" ? (
          <InfoImage loading="lazy" src={imageSrc} />
        ) : (
          <StartButton>{buttonLabel}</StartButton>
        )}
      </InfoContent>
    </SectionCard>
  );
}

function Dashboard() {
  const [showDrop, setShowDrop] = useState(false);
  const { profile } = useAuth();

  if (!profile) {
    return <div>Loading...</div>;
  }
  const testInfos = [
    {
      title: "Test 1",
      difficulty: "easy",
      questions: 20,
      time: "15 mins",
      imageSrc: "",
      status: "active",
      buttonLabel: "Start",
    },
    {
      title: "Test 2",
      difficulty: "easy",
      questions: 20,
      time: "15 mins",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/86979919fb4649685b09a11fe4e04152a5859859c9fa99363941b6705c39d316?apiKey=9fbb9e9d71d845eab2e7b2195d716278&",
      status: "locked",
    },
    {
      title: "Test 3",
      difficulty: "medium",
      questions: 20,
      time: "15 mins",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/86979919fb4649685b09a11fe4e04152a5859859c9fa99363941b6705c39d316?apiKey=9fbb9e9d71d845eab2e7b2195d716278&",
      status: "locked",
    },
    {
      title: "Test 4",
      difficulty: "medium",
      questions: 20,
      time: "15 mins",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/86979919fb4649685b09a11fe4e04152a5859859c9fa99363941b6705c39d316?apiKey=9fbb9e9d71d845eab2e7b2195d716278&",
      status: "locked",
    },
    {
      title: "Test 5",
      difficulty: "hard",
      questions: 20,
      time: "15 mins",
      imageSrc:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/86979919fb4649685b09a11fe4e04152a5859859c9fa99363941b6705c39d316?apiKey=9fbb9e9d71d845eab2e7b2195d716278&",
      status: "locked",
    },
  ];

  return (
    <Wrapper>
      {/* <ImageWrapper> */}
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
      {/* </ImageWrapper> */}

      <HeaderBar>
        <HeaderContent>
          <Logo>
            <TitleLogo>Q SkillsElevate</TitleLogo>
          </Logo>
          <ProfileImg
            onClick={() => setShowDrop(true)}
            loading="lazy"
            src={profile.picture}
          />
        </HeaderContent>
      </HeaderBar>
      {showDrop && <AccountDrop onClose={() => setShowDrop(false)} />}
      <Tests>
        <Subheading>
          <DropFilter>Select Category ▼</DropFilter>
          <SectionTitle>Evaluate Your Skills!</SectionTitle>
        </Subheading>
        <TestGridContainer>
          <TestGrid>
            {testInfos.map((info, idx) => (
              <TestInfo key={idx} {...info} />
            ))}
          </TestGrid>
        </TestGridContainer>
      </Tests>
      <SecondarySection>
        <SecondaryContent>
          <EnhanceSkills>
            <EnhanceTitle>Enhance Your Skills</EnhanceTitle>
            <EnhanceInner>
              <EnhanceItem>
                <EnhanceImage
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/3eb0553d22a80db3842d703e9f9884b5b0e90cfbc94657a7a7fc53110af30929?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
                />
              </EnhanceItem>
              <EnhanceDescription>
                <DescriptionText>
                  Turn practice into a habit, just like brushing your teeth each
                  day, success will greet you in every way. Keep practicing,
                  keep striving, soon you'll see, your brain power will soar
                  high
                </DescriptionText>
              </EnhanceDescription>
            </EnhanceInner>
            <PracticeButton>Start Practice</PracticeButton>
          </EnhanceSkills>
          <ReviewStats>
            <StatsTitle>Review Statistics</StatsTitle>
            <StatsInner>
              <StatsDescription>
                Check your personalized dashboard for a detailed look at your
                learning journey, including progress, strengths, and areas for
                growth.
              </StatsDescription>
              <StatsImage
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/809b034d32755b7266ad678342ec0131514cfa24856d697cbd25583dbdb7e1f6?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
              />
            </StatsInner>
            <StatsButton>Take a Look</StatsButton>
          </ReviewStats>
        </SecondaryContent>
      </SecondarySection>
    </Wrapper>
  );
}

const Subheading = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const DropFilter = styled.div`
  font-familiy: poppins;
  display: flex;
  height: 40px;
  width: 140px;
  border-radius: 20px;
  border: 2px solid #6a5ae0;
  color: #6a5ae0;
  align-items: center;
  justify-content: center;
`;

const Circle = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 40%;
  position: absolute;
  right: 0;
  top: 0;
  max-width: 100%;
  margin-top: 80px;
  align-self: flex-end;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

const Cube = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 40%;
  max-width: 100%;
  margin-top: auto;
  left: 0;
  bottom: 0;
  align-self: flex-start;
  position: absolute;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;
const ProfileImg = styled.img`
  margin-right: 30px;
  width: 60px;
  cursor: pointer;
  border-radius: 50%;
  @media (max-width: 991px) {
    width: 40px;
    margin-right: 10px;
  }
`;

const Wrapper = styled.div`
  background-color: #cdc9f3;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: 0px;
  top: 0px;
  position: absolute;
  padding: 100px 0 100px;
  width: 100%;
`;

const HeaderBar = styled.header`
  position: fixed;
  top: 0px;
  z-index: 2;
  box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.1);
  background-color: #e8e5fa;
  display: flex;
  width: 100%;
  gap: 20px;
  justify-content: space-between;
  padding: 15px 24px 15px 68px;
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    padding: 0 20px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
  justify-content: space-between;

  @media (max-width: 991px) {
    flex-wrap: wrap;
    align-items: center;
  }
`;

const Logo = styled.div`
  display: flex;
  gap: 15px;
`;

const TitleLogo = styled.span`
  color: #4d4d4d;
  font-family: Hina Mincho, sans-serif;
  font-size: 35px;
  @media (max-width: 991px) {
    font-size: 35px;
    margin-left: 10px;
  }
`;

const SectionTitle = styled.h2`
  color: #000;
  align-self: start;
  margin-left: 17px;
  font-size: 32px;
  font-family: "Quantico", sans-serif;
  @media (max-width: 991px) {
    margin-left: 10px;
  }
`;

const Tests = styled.div`
  border-radius: 20px;
  z-index: 1;
  backdrop-filter: blur(10px);
  background-color: rgba(254, 254, 255, 0.5);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  margin-top: 26px;
  padding: 37px 29px;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; /* Center content horizontally */
  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const TestGridContainer = styled.div`
  margin-top: 27px;
  width: 95%;
  padding: 0 20px 0 20px;
  display: flex;
  justify-content: space-around;
  overflow-x: auto; /* Enable horizontal scrolling for content overflow */
`;

const TestGrid = styled.div`
  display: flex;
  flex-wrap: no-wrap; /* Allow items to wrap as needed */
  justify-content: center; /* Center items horizontally */
  align-items: center; /* Center items vertically */
  gap: 20px;
  min-height: 100%; /* Ensure TestGrid takes at least full height */
  padding-bottom: 20px; /* Add some padding at the bottom to handle content overflow */
  box-sizing: border-box; /* Include padding and border in element's total width and height */
  @media (max-width: 991px) {
    flex-direction: row;
    gap: 10px;
  }
`;

const SectionCard = styled.article`
  display: flex;
  gap: 15px;
  font-weight: 400;
  text-align: center;
  line-height: normal;
  flex-direction: column;
  @media (max-width: 991px) {
    margin-top: 33px;
  }
`;

const InfoImage = styled.img`
  aspect-ratio: 1;
  width: 50px;
  margin-top: 30px;
  padding: 15px;
  align-self: center;
`;

const InfoContent = styled.div`
  padding: 30px 15px 20px;
  width: 200px;
  background-color: #fff;
  border: 2px solid rgba(143, 128, 255, 1);
  border-radius: 20px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  @media (max-width: 991px) {
    padding: 20px 20px 20px 20px;
  }
`;

const InfoDetails = styled.div`
  color: #000;
  font-size: 22px;
  line-height: 38px;
  font-family: "Abhaya Libre", sans-serif;
`;

const Title = styled.span`
  font-family: "Quattrocento", sans-serif;
  font-size: 26px;
`;

const DetailText = styled.p`
  font-size: 16px;
  line-height: 20px;
  font-family: "Quattrocento", sans-serif;
`;

const Break = styled.br``;

const StartButton = styled.button`
  background-color: rgba(106, 90, 224, 0.9);
  color: #fff;
  border-radius: 10px;
  padding: 20px 35px;
  font-size: 24px;
  font-family: "Abhaya Libre", sans-serif;
  align-self: center;
  justify-content: center;
  margin-top: 40px;
  cursor: pointer;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

const SecondarySection = styled.div`
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  z-index: 1;
  align-items: center; /* Center content horizontally */
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const SecondaryContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  width: 83%;
  @media (max-width: 991px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const EnhanceSkills = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-color: #fff;
  padding: 40px 50px 20px;
  @media (max-width: 991px) {
    padding: 0 20px;
    width: 90%;
  }
`;

const EnhanceTitle = styled.h3`
  color: #000;
  font-size: 32px;
  font-family: "Quantico", sans-serif;
  align-self: start;
  margin-left: 34px;
  @media (max-width: 991px) {
    margin-left: 10px;
  }
`;

const EnhanceInner = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 4px;
  @media (max-width: 991px) {
    flex-direction: column;
    gap: 0;
  }
`;

const EnhanceItem = styled.div`
  width: 55%;
  display: flex;
  flex-direction: column;
  @media (max-width: 991px) {
    width: 95%;
  }
`;

const EnhanceImage = styled.img`
  width: 100%;
  aspect-ratio: 1.54;
  flex-grow: 1;
  object-fit: contain;
`;

const EnhanceDescription = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  @media (max-width: 991px) {
    width: 95%;
  }
`;

const DescriptionText = styled.p`
  color: #000;
  text-align: justify;
  font-size: 16px;
  line-height: 28px;
  font-family: "Quattrocento Sans", sans-serif;
`;

const PracticeButton = styled.button`
  background-color: rgba(106, 90, 224, 0.9);
  color: #fff;
  border-radius: 10px;
  padding: 23px 60px;
  font-size: 24px;
  font-family: "Abhaya Libre", sans-serif;
  align-self: center;
  justify-content: center;
  margin-top: auto;
  cursor: pointer;
  @media (max-width: 991px) {
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 20px;
    padding: 15px 30px;
  }
`;

const ReviewStats = styled.div`
  width: 37%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  background-color: #fff;
  padding: 43px 32px 26px;
  @media (max-width: 991px) {
    padding: 0 20px;
    width: 90%;
  }
`;

const StatsTitle = styled.h3`
  color: #000;
  font-size: 32px;
  font-family: "Quantico", sans-serif;
`;

const StatsInner = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 19px;
  @media (max-width: 991px) {
    width: 100%;
    flex-direction: column-reverse;
    align-items: center;
  }
`;

const StatsDescription = styled.p`
  width: 55%;
  color: #000;
  text-align: justify;
  font-size: 16px;
  line-height: 25px;
  font-family: "Quattrocento Sans", sans-serif;
  @media (max-width: 991px) {
    width: 90%;
  }
`;

const StatsImage = styled.img`
  width: 20%;
  aspect-ratio: 1.01;
  flex-grow: 1;
  object-fit: contain;
  @media (max-width: 991px) {
    width: 90%;
  }
`;

const StatsButton = styled.button`
  background-color: rgba(106, 90, 224, 0.9);
  color: #fff;
  bottom: 10px;
  border-radius: 10px;
  padding: 22px 50px;
  font-size: 24px;
  font-family: "Abhaya Libre", sans-serif;
  align-self: center;
  justify-content: center;
  margin-top: auto;
  cursor: pointer;
  @media (max-width: 991px) {
    margin-top: 40px;
    margin-bottom: 20px;
    font-size: 20px;
    padding: 15px 30px;
  }
`;

export default Dashboard;
