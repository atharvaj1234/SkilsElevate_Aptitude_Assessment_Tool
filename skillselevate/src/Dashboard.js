import React, { useEffect, useState } from "react";
import AccountDrop from "./components/AccountDrop";
import PersonlizationProfile from "./components/PersonlizeProfile";
import CircularProgress from "@mui/material/CircularProgress";
import styled from "styled-components";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import CategoryDropdown from "./components/CategoryDropdown";

const Category = [
  {
    Exam: "Default",
    Category: [
      "Reasoning",
      "Mathematical Skills",
      "General Awareness",
      "Language Comprehension",
      "Analysis",
      "Indian & Global Environment",
    ],
  },
  {
    Exam: "MAT",
    Category: [
      "Language Comprehension",
      "Analysis",
      "Mathematical Skills",
      "Reasoning",
      "Indian & Global Environment",
    ],
  },
  {
    Exam: "CAT",
    Category: [
      "Analysis",
      "Language Comprehension",
      "Mathematical Skills",
      "Reasoning",
    ],
  },
  {
    Exam: "UCO",
    Category: [
      "Language Comprehension",
      "General Awareness",
      "Reasoning",
      "Computer Aptitude",
      "Analysis",
    ],
  },
  {
    Exam: "UIEO",
    Category: [
      "Vocabulary",
      "Functional Grammer",
      "Language Comprehension",
      "Interactive English",
    ],
  },
];
const Dashboard = () => {
  const [showDrop, setShowDrop] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [showPersonlization, setShowPersonlization] = useState(false);
  const [testInfos, setTestInfos] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const imageSrc =
    "https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FIcons%2Flock.png?alt=media&token=0db4afea-dfb8-41f0-80f7-ef4b2d25f8f8";
  let [data, setName] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Mock");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredTestInfos = selectedCategory
    ? Object.entries(testInfos).reduce((acc, [testid, testData]) => {
        if (testData.category === selectedCategory) {
          acc[testid] = testData;
        }
        return acc;
      }, {})
    : testInfos;

  const fetchUser = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data);
      if (data.exam === null) {
        setShowPersonlization(true);
      } else {
        await getdata();
        const filter = Category.filter(
          (category) => category.Exam === data.exam
        );
        setCategories(filter[0].Category);
      }
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  const getdata = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc1 = await getDocs(q);
      const data = doc1.docs[0].data();
      const docRef = doc(db, "tests", data.exam);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let fetched = docSnap.data();
        setTestInfos(fetched);
        console.log(fetched);
      } else {
        console.log("No such document!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.title = "SkillsElevate - Dashboard"
    if (loading) return;
    if (!user) return navigate("/");
    if (error) console.log(error);
    fetchUser();
    // eslint-disable-next-line
  }, [user, loading]);

  function TestInfo({ testInfos }) {
    const curtest = (data.userdata.CurrentTest === 0) ? (1) : (data.userdata.CurrentTest); 
    if (Object.keys(testInfos).length === 0)
      return <p>No Tests Found for the Selected Category</p>;
    const sortedTestInfos = Object.entries(testInfos).sort(
      ([keyA, dataA], [keyB, dataB]) => {
        return dataA.title.localeCompare(dataB.title);
      }
    );
    return (
      <>
        {sortedTestInfos.map(([testid, testData]) => (
          (testid !== "demo")&&(<SectionCard key={testid}>
            <InfoContent>
              <InfoDetails>
                <Title>{testData.title}</Title>
                <Break />
                <DetailText>
                  Difficulty level: {testData.difficultyLevel}
                </DetailText>
                <DetailText>
                  No. of questions: {testData.question.length}
                </DetailText>
                <DetailText>Time: {testData.time} minutes</DetailText>
              </InfoDetails>
              {parseInt(testid.replace(/\D/g, "")) <=
              curtest ? (
                parseInt(testid.replace(/\D/g, "")) <
                curtest ? (
                  <StartButton
                    onClick={() =>
                      navigate("/test", { state: { testId: testid , testTitle: testData.title} })
                    }
                  >
                    Retake
                  </StartButton>
                ) : (
                  <StartButton
                    onClick={() =>
                      navigate("/test", { state: { testId: testid , testTitle: testData.title} })
                    }
                  >
                    Start
                  </StartButton>
                )
              ) : (
                <InfoImage loading="lazy" src={imageSrc} />
              )}
            </InfoContent>
          </SectionCard>)
          
        ))}
      </>
    );
  }

  return (
    <Wrapper>
      {/* <ImageWrapper> */}
      <Circle
        loading="lazy"
        src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2Fcircle.png?alt=media&token=f0b79718-d8a9-43d3-8db0-aa307eec5d81"
        alt="First image"
      />
      <Cube
        loading="lazy"
        src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2Fcube.png?alt=media&token=72a182b5-e403-4920-81eb-db2966e82ccd"
        alt="Second image"
      />
      {/* </ImageWrapper> */}

      {showPersonlization && (
        <Overlay>
          <PersonlizationProfile />
        </Overlay>
      )}

      <HeaderBar>
        <HeaderContent>
          <Logo>
            <TitleLogo onClick={()=>navigate('/')}>Q SkillsElevate</TitleLogo>
          </Logo>
          <ProfileImg
            onClick={() => setShowDrop(true)}
            loading="lazy"
            src={data.profilepicture}
          />
        </HeaderContent>
      </HeaderBar>
      {showDrop && <AccountDrop onClose={() => setShowDrop(false)} />}
      <Tests>
        <Subheading>
          <CategoryDropdown
            categories={categories}
            onCategorySelect={handleCategorySelect}
          />
          <SectionTitle>Evaluate Your Skills!</SectionTitle>
        </Subheading>
        <TestGridContainer>
          <TestGrid>
            {!data && <CircularProgress />}
            {data && <TestInfo testInfos={filteredTestInfos} />}
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
                  src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FEnhance.png?alt=media&token=88e41774-91d2-4259-8838-c48ad6f27b49"
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
            <PracticeButton onClick={() => navigate("/practice")}>
              Start Practice
            </PracticeButton>
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
                src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FStats.png?alt=media&token=5b409acc-453b-4792-b040-0a10393dbcf2"
              />
            </StatsInner>
            <StatsButton onClick={()=> navigate("/statistics")}>Take a Look</StatsButton>
          </ReviewStats>
        </SecondaryContent>
      </SecondarySection>
    </Wrapper>
  );
};

const Overlay = styled.div`
  position: fixed;
  z-index: 3;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Subheading = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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
  cursor: pointer;
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
  width: 210px;
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
  font-size: 20px;
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
