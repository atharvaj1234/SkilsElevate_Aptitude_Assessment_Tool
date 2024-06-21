import React, { useState , useEffect } from 'react';
import styled from "styled-components";
import Signup from './components/Signup'; 


const Container = styled.div`
  background-color: #fff;
  display: flex;
  left: 0px;
  top: 0px;
  position: absolute;
  width: 100%;
  flex-direction: column;
  justify-content: center;
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  min-height: 2388px;
  width: 100%;
  padding-bottom: 80px;
  align-items: center;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  filter: blur(1px);
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
`;

const Header = styled.header`
  position: fixed;
  top: 0px;
  z-index:1;
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

const LogoWrapper = styled.div`
  display: flex;
  gap: 15px;
  height: 55px;
  font-weight: 400;
`;


const LogoText = styled.div`
  color: #4d4d4d;
  font-family: Hina Mincho, sans-serif;
  font-size: 35px;
  @media (max-width: 991px) {
    font-size: 35px;
    margin-left:10px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
  font-size: 16px;
  color: #060710;
  font-weight: 400;
  line-height: 90%;
  margin-top: 20px;
  margin-right: 40px;
  @media (max-width: 991px) {
    line-height: 20px;
    margin-right: 10px;
    font-size: 14px;
  }
`;

const NavLink = styled.a`
  font-family: Inter, sans-serif;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

const MainSection = styled.section`
  position: relative;
  margin-top: 200px;
  width: 100%;
  max-width: 1119px;
  @media (max-width: 991px) {
    max-width: 100%;
    margin-top: 40px;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 991px) {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
`;

const ColumnPrimary = styled(Column)`
  width: 56%;
  @media (max-width: 991px) {
    width: 100%;
  }
`;

const MainInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  color: #000;
  font-weight: 400;
  line-height: 38px;
  margin: auto 0;
  padding: 0 20px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

const MainTitle = styled.h1`
  font: 72px/53% Hina Mincho, sans-serif;
  @media (max-width: 991px) {
    font-size: 50px;
    align-self:center;
  }
`;

const MainDescription = styled.p`
  margin-top: 63px;
  font: 24px Abhaya Libre, sans-serif;
  @media (max-width: 991px) {
    margin-top: 40px;
    align-self: center;
    text-align:center;
  }
`;

const CallToAction = styled.button`
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  background-color: #6a5ae0;
  align-self: start;
  margin-top: 31px;
  color: #fff;
  text-align: center;
  padding: 15px;
  font: 20px Abhaya Libre, sans-serif;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 15px;
    align-self:center;
  }
`;

const ColumnSecondary = styled(Column)`
  width: 44%;
  margin-left: 20px;
  @media (max-width: 991px) {
    margin-left:0px;
    width: 100%;
  }
`;

const MainImage = styled.img`
  aspect-ratio: 1.02;
  object-fit: auto;
  object-position: center;
  width: 100%;
  align-self: stretch;
  mix-blend-mode: multiply;
  flex-grow: 1;
  @media (max-width: 991px) {
    margin-top: 40px;
    width: 60%;
    align-self: center;
  }
`;

const Section = styled.section`
  position: relative;
  width: 90%;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  background-color: rgba(255, 253, 253, 0.2);
  display: flex;
  margin-top: 154px;
  max-width: 1372px;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

const SectionContent = styled.div`
  border-radius: 20px;
  background: linear-gradient(
    110deg,
    rgba(255, 253, 253, 1) 50%,
    rgba(153, 152, 152, 0.2) 85%
  );
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  padding: 53px 37px;
  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const SectionContent1 = styled.div`
  border-radius: 20px;
  background: linear-gradient(
    110deg,
    rgba(153, 152, 152, 0.2) 15%,
    rgba(255, 253, 253, 1) 50%
  );
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  padding: 53px 37px;
  @media (max-width: 991px) {
    padding: 0 20px;
  }
`;

const SectionTitle = styled.h2`
  color: #000;
  text-align: center;
  align-self: center;
  font: 400 40px Jacques Francois, sans-serif;
`;

const SectionDescription = styled.div`
  margin-top: -16px;
  @media (max-width: 991px) {
    margin-top: 32px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 991px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0px;
  }
`;
const ContentContainer1 = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 991px) {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0px;
  }
`;

const SectionColumn = styled.div`
  display: flex;
  flex-direction: column;
  line-height: normal;
  width: 50%;
  @media (max-width: 991px){
    width: 100%;
  }
`;

const SectionImage = styled.img`
  object-fit: contain;
  object-position: center;
  width: 100%;
  height: auto; 
  mix-blend-mode: multiply;
  flex-grow: 1;
  @media (max-width: 991px) {
    margin-top: 23px;
    max-height:50%;
  }
`;
const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  color: #241f1f;
  font-weight: 400;
  text-align: justify;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
`;

const SectionText = styled.p`
  font: 20px/35px Abhaya Libre, sans-serif;
  @media (max-width: 991px) {
    margin-top: 24px;
  }
`;

const InlineLink = styled.a`
  font-weight: 700;
`;

const SectionLinkContainer = styled.div`
  align-self: end;
  display: flex;
  margin-top: 22px;
  gap: 11px;
  line-height: 156%;
  @media (max-width: 991px) {
    margin-bottom: 20px;
  }
`;

const SectionLink = styled.button`
  font-family: Abhaya Libre, sans-serif;
  font-size: 28px;
  text-decoration: underline;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
`;

const SectionIcon = styled.img`
  aspect-ratio: 0.64;
  object-fit: auto;
  object-position: center;
  width: 18px;
  height: auto;
`;

const Footer = styled.footer`
display: flex;
color: #fff;
gap: 20px;
padding: 10px;
z-index:1;
font-size: 16px;
font-weight: 600;
line-height: 150%;
justify-content: center;
align-content: center;
margin: auto 0;
padding: 0 20px;
@media (max-width: 991px) {
  z-index: -1;
}
`;


const NavBar = styled.nav`
  display: flex;
  gap: 20px;
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
  justify-content: space-between;
  margin: auto 0;
  padding: 0 20px;
`;

const NavItem = styled.a`
  font-family: Quicksand, sans-serif;
  cursor: pointer;
`;

const Brand = styled.h1`
  gap: 20px;
  justify-content: space-between;
  margin: auto 0;
  padding: 0 20px;
  font-size: 36px;
  font-weight: 600;
  line-height: 150%;
  font-family: Quicksand, sans-serif;
`;

const FooterText = styled.h1`
  flex-grow: 1;
  flex-basis: auto;
  gap: 20px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
  font-family: Quicksand, sans-serif;
`;


const Overlay = styled.div`
  position: fixed;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;


function LandingPage() {
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    document.title = 'SkillsElevate';
  })

  const handleCloseOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      setShowSignup(false);
    }
  };
  

  return (
    <Container>
      <AppWrapper>
        <BackgroundImage loading="lazy" src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2Fbackground.png?alt=media&token=f5b836cb-6b4f-4124-bf2a-f99555fd0349" alt="" />
        <Header>
          <LogoWrapper>
            <LogoText>Q  SkillsElevate</LogoText>
          </LogoWrapper>
          <Nav>
            <NavLink href="#about">About Us</NavLink>
            <NavLink onClick={() => setShowSignup(true)}>Login</NavLink>
          </Nav>
        </Header>
        {showSignup && (
        <Overlay onClick={handleCloseOutsideClick}>
          <Signup />
        </Overlay>
      )}
        <MainSection>
          <FlexContainer>
            <ColumnPrimary>
              <MainInfo>
                <MainTitle>SkillsElevate</MainTitle>
                <MainDescription>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </MainDescription>
                <CallToAction  onClick={() => setShowSignup(true)}>Try Now! It’s Free</CallToAction>
              </MainInfo>
            </ColumnPrimary>
            <ColumnSecondary>
              <MainImage
                loading="lazy"
                src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2Fhero.png?alt=media&token=dd757686-2c0a-42a6-a3b8-af6c8647f33c"
                alt="Illustration showing skills enhancement"
              />
            </ColumnSecondary>
          </FlexContainer>
        </MainSection>
        <Section id="about">
          <SectionContent>
            <SectionTitle>What we do?</SectionTitle>
            <SectionDescription>
              <ContentContainer>
                <SectionColumn>
                  <SectionImage
                    loading="lazy"
                    src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2Fskillup.png?alt=media&token=940aaaae-0bab-4c6a-b06b-b88424e7a02e"
                    alt="Image describing our services"
                  />
                </SectionColumn>
                <SectionColumn>
                  <TextContent>
                    <SectionText>
                      We aim revolutionizing education by offering a
                      comprehensive online platform dedicated to empowering
                      students on their journey towards
                      <InlineLink> academic excellence</InlineLink> and
                      <InlineLink> personal growth</InlineLink>.<br />
                      SkillsElevate is designed to enhance skills across five
                      critical domains:{" "}
                      <InlineLink>
                        Verbal Ability, Quantitative Reasoning, Logical
                        Reasoning, General Knowledge (GK), and Current Affairs.
                      </InlineLink><br />
                      Join Us on Your Path to Excellence. Dive into a world
                      where learning is not just about memorization but about
                      <InlineLink> understanding, applying, and excelling.</InlineLink>
                    </SectionText>
                    <SectionLinkContainer>
                      <SectionLink onClick={() => setShowSignup(true)}>Up Skill Yourself </SectionLink>
                      <SectionIcon loading="lazy" src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FIcons%2Frightarrow.png?alt=media&token=400417f6-39d7-4886-a568-61841c2a5ee2" alt="" />
                    </SectionLinkContainer>
                  </TextContent>
                </SectionColumn>
              </ContentContainer>
            </SectionDescription>
          </SectionContent>
        </Section>
        <Section>
          <SectionContent1>
            <SectionTitle>How would you know that we deliver?</SectionTitle>
            <SectionDescription>
              <ContentContainer1>
                <SectionColumn>
                  <TextContent>
                    <SectionText>
                      We steadfastly adhere to{" "}
                      < InlineLink> transparency and accountability </InlineLink>
                      , vital for trust and reliability in education. To
                      consistently
                      <InlineLink> meet and surpass your expectations</InlineLink>
                      , we've introduced:
                      <br />
                      <InlineLink> Transparent Progress Tracking:</InlineLink>{" "}
                      Stay informed throughout your learning journey with
                      real-time progress updates, showing your current status
                      against your objectives.
                      <br />
                      <InlineLink> Detailed Performance Analytics:</InlineLink>{" "}
                      Receive insightful post-session reports that dissect your
                      performance, pinpointing strengths and areas for growth.
                      We are devoted to maintaining the highest levels of
                      transparency and accountability. Join us on this journey,
                      where your feedback is valued, and
                      <InlineLink> your success is our mission.</InlineLink>{" "}
                      Together, we'll confidently chart the course to academic
                      excellence.
                    </SectionText>
                    <SectionLinkContainer>
                      <SectionLink onClick={() => setShowSignup(true)}>Take a Test</SectionLink>
                      <SectionIcon loading="lazy" src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FIcons%2Frightarrow.png?alt=media&token=400417f6-39d7-4886-a568-61841c2a5ee2" alt="" />
                    </SectionLinkContainer>
                  </TextContent>
                </SectionColumn>
                <SectionColumn>
                  <SectionImage
                    loading="lazy"
                    src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2Ftest.png?alt=media&token=a6607aff-b2ea-475d-b529-d316eb315920"
                    alt="Illustration of progress tracking"
                  />
                </SectionColumn>
              </ContentContainer1>
            </SectionDescription>
          </SectionContent1>
        </Section>
        <Footer>
        <NavBar>
        <NavItem>Dashboard</NavItem>
        <NavItem>About Us</NavItem>
        <NavItem>Explore</NavItem>
      </NavBar>
      <Brand>Q</Brand>
      <FooterText>Copyright © SkillsElevate 2024</FooterText>
        </Footer>
      </AppWrapper>
    </Container>
  );
}

export default LandingPage;
