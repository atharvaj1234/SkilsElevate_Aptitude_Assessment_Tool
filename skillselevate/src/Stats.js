import React, { useEffect, useState } from "react";
import AccountDrop from "./components/AccountDrop";
import Loader from './components/Loader';
import styled from "styled-components";
import { auth, db } from "./firebase";
import { query, collection, getDocs, where, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import PerformanceGraph from "./components/PerformanceGraph";
import ProgressGraph from "./components/ProgressGraph";

const Dashboard = () => {
  const [showDrop, setShowDrop] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [data, setName] = useState();
  const [topUsers, setTopUsers] = useState([]);
  const [viewAll, setviewAll] = useState(false);
  const navigate = useNavigate();

  const fetchTopUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, orderBy("profilescore", "desc"));
      const querySnapshot = await getDocs(q);
      const topUsers = querySnapshot.docs.map((doc) => doc.data());
      // Do something with the topUsers data
      console.log(topUsers);
      setTopUsers(topUsers);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching top users");
    }
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (error) console.log(error);
    fetchUserName();
    fetchTopUsers();
    // eslint-disable-next-line
  }, [user, loading]);

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
      {data && (
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
      )}
      {showDrop && <AccountDrop onClose={() => setShowDrop(false)} />}
        {topUsers.length <= 0 && <Loader/>}
      {topUsers.length > 0 && (
        <>
          <HeroImage loading="lazy" src={data.userdata.badgeUrl} />
          <Banner>
            <Rank>#4</Rank>
            <Description>
              You are doing better than 60% of other learners!
            </Description>
          </Banner>
          <MainSection>
            <FeatureWrapper>
              <FeatureColumn>
                <Img
                  onClick={() => setShowDrop(true)}
                  loading="lazy"
                  src={topUsers[1].profilepicture}
                />
                <PointsContainer>{topUsers[1].profilescore} QP</PointsContainer>
                <SecondaryImage
                  loading="lazy"
                  src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FStatsBoard%2Fleftboard.svg?alt=media&token=1ef93ff6-0f88-4508-9c02-d81d89c389ab"
                  alt="Secondary"
                />
                <FeatureBox2>2</FeatureBox2>
              </FeatureColumn>
              <FeatureColumn>
                <Img
                  onClick={() => setShowDrop(true)}
                  loading="lazy"
                  src={topUsers[0].profilepicture}
                />
                <PointsContainer>{topUsers[0].profilescore} QP</PointsContainer>
                <ProfileImage
                  loading="lazy"
                  src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FStatsBoard%2Fcenterboard.svg?alt=media&token=085a43ce-b18d-401b-b5a2-2718ebfa0cad"
                  alt="Profile"
                />
                <MainFeature>1</MainFeature>
              </FeatureColumn>

              <FeatureColumn>
                <Img
                  onClick={() => setShowDrop(true)}
                  loading="lazy"
                  src={topUsers[2].profilepicture}
                />
                <PointsContainer>{topUsers[2].profilescore} QP</PointsContainer>
                <SecondaryImage
                  loading="lazy"
                  src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FStatsBoard%2Frightboard.svg?alt=media&token=9635e0b8-a9e1-4d5b-8c11-815518e1fc75"
                  alt="Secondary"
                />
                <FeatureBox3>3</FeatureBox3>
              </FeatureColumn>
            </FeatureWrapper>
          </MainSection>
          <Container>
            <BackgroundImage
              loading="lazy"
              src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FStatsBoard%2Fleaberboard.svg?alt=media&token=6a92f6e9-e70b-4e82-a006-37338968e235"
            />
            <main>
              {topUsers.map((user, index) => {
                if (user.uid === data.uid || viewAll) {
                  return (
                    <UserCard key={index}>
                      <Rank1>{index + 1}</Rank1>
                      <Avatar loading="lazy" src={user.profilepicture} />
                      <UserInfo>
                        <UserName>{user.name}</UserName>
                        <UserPoints>{user.profilescore} points</UserPoints>
                      </UserInfo>
                    </UserCard>
                  );
                }
                return null; // Return null for users that don't match the condition
              })}
            </main>
            <Viewall onClick={() => setviewAll(!viewAll)}>
              {viewAll ? "View Less" : "View All"}
            </Viewall>
          </Container>
          <GraphHolder>
            <Graph>
              {" "}
              <PerformanceGraph />
            </Graph>

            <Graph>
              {" "}
              <ProgressGraph />
            </Graph>
          </GraphHolder>
        </>
      )}
    </Wrapper>
  );
};

const Viewall = styled.p`
  z-index: 2;
  color: #555;
  align-self: center;
  font-size: 14px;
  cursor: pointer;
  @media (max-width: 570px) {
    font-size: 12px;
  }
`;

const GraphHolder = styled.div`
display: flex;
justify-content: center;
width: 100%;
z-index: 1;
flex- direction: row;
flex-wrap: wrap;
@media (max-width: 570px){
justify-content: sterech;
  flex-direction:column;
  width: 80%;
  gap: 20px;
}
`;

const Graph = styled.div`
  align-self: center;
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  width: 40%;
  margin: 40px;
  padding: 20px;
  @media (max-width: 570px) {
    width: 95%;
    margin: 0;
    padding: 10px;
  }
`;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  width: 40%;
  padding: 20px;
  margin-top: -10px;
  z-index: 2;
  @media (max-width: 991px) {
    padding: 0 20px;
    width: 80%;
  }
`;

const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 10px;
`;

const UserCard = styled.article`
  position: relative;
  border-radius: 20px;
  background-color: var(--Neutral-White, #fff);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 80px 18px 34px;
  margin-top: 20px;
  @media (max-width: 991px) {
    flex-wrap: wrap;
    margin-top: 30px;
    padding: 10px 20px;
  }
`;

const Rank1 = styled.div`
  stroke-width: 1.5px;
  border: 2px solid rgba(230, 230, 230, 1);
  border-radius: 50%;
  color: var(--Neutral-Grey-2, #858494);
  text-align: center;
  padding: 5px 10px;
  font: 500 12px/150% Rubik, sans-serif;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const Avatar = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 56px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h2`
  color: var(--Neutral-Black, #0c092a);
  font: 500 16px/150% Rubik, sans-serif;
  margin: 0;
`;

const UserPoints = styled.p`
  color: var(--Neutral-Grey-2, #858494);
  margin-top: 13px;
  font: 400 14px/140% Rubik, sans-serif;
`;

const Img = styled.img`
  border-radius: 50%;
  aspect-ratio: 1;
  width: 70px;
  align-self: center;
`;

const PointsContainer = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  border-radius: 10px;
  background-color: var(--Color-Secondary, #9087e5);
  margin: 10px;
  padding: 10px;
  font: 12px Rubik, sans-serif;
`;

const MainSection = styled.div`
  display: flex;
  font-size: 80px;
  color: var(--Neutral-White, #fff);
  font-weight: 700;
  white-space: nowrap;
  text-align: center;
  line-height: 140%;
  z-index: 1;
`;

const ProfileImage = styled.img`
  aspect-ratio: 7.14;
  object-fit: auto;
  object-position: center;
  width: 116px;
  fill: #cdc9f3;
  align-self: center;
  max-width: 100%;
`;

const FeatureWrapper = styled.div`
  display: flex;
  gap: 0;
  padding: 0 20px;
  align-items: flex-end;
`;

const FeatureColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const SecondaryImage = styled.img`
  aspect-ratio: 6;
  object-fit: auto;
  object-position: center;
  width: 110px;
  fill: #aea7ec;
  align-self: center;
`;

const FeatureBox2 = styled.div`
  font-family: "Abhaya Libre", sans-serif;
  background-color: var(--Color-Secondary, #9087e5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 33px;
  height: 120px;
`;

const FeatureBox3 = styled.div`
  font-family: "Abhaya Libre", sans-serif;
  background-color: var(--Color-Secondary, #9087e5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 33px;
  height: 80px;
`;

const MainFeature = styled.div`
  background: linear-gradient(180deg, #9087e5 0%, #cdc9f3 70.33%);
  padding: 36px 38px 80px;
  font: 100px Abhaya Libre, sans-serif;
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
  z-index: 3;
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

const HeroImage = styled.img`
  aspect-ratio: 0.95;
  object-fit: auto;
  object-position: center;
  width: 178px;
  z-index: 1;
  max-width: 100%;
  mix-blend-mode: multiply;
`;

const Banner = styled.header`
  border-radius: 20px;
  background-color: #ffb380;
  display: flex;
  width: 100%;
  max-width: 553px;
  gap: 20px;
  color: #fff;
  line-height: 150%;
  padding: 16px 32px;
  z-index: 1;
  margin-bottom: 20px;
  @media (max-width: 991px) {
    max-width: 80%;
    padding: 0 15px 0 0;
  }
`;

const Rank = styled.div`
  align-items: start;
  border-radius: 20px;
  background-color: #ff9b57;
  white-space: nowrap;
  justify-content: center;
  padding: 20px 14px;
  font: 700 24px Abhaya Libre, sans-serif;
  @media (max-width: 991px) {
    padding-right: 20px;
    white-space: initial;
  }
`;

const Description = styled.p`
  flex-grow: 1;
  flex-basis: auto;
  margin: auto 0;
  font: 500 16px Rubik, sans-serif;
`;

export default Dashboard;
