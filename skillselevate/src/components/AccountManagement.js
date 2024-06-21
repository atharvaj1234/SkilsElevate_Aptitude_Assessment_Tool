import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { changePassword, updateName } from "../firebase";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AccountManagement = ({ onClose }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
    if (error) console.log(error);
    // eslint-disable-next-line
  }, [user, loading]);

  const updateAccount = async () => {
    if (password !== "" && currentPassword !== "")
      await changePassword(currentPassword, password);
    if (name !== "") 
      await updateName(name);
  };

  return (
    <SignupForm>
      <Container>
        <Card>
          <Title>Manage Account</Title>
          <Subtitle>Manage you SkillsElevate account</Subtitle>
          <div>
            <InputGroup marginTop="5%">
              <Icon
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a592f3e6a871ed42db10bc4b9f20d0695722c54d3a3fcd5c1e267f84847048a?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
                alt="User Icon"
              />
              <TransparentInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user?.displayName}
              />
            </InputGroup>
            <InputGroup marginTop="5%">
              <Icon
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf7ac098f5db87311adb5bb39ad666714d75de6cb890f8468d9b4fea61602d32?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
                alt="Password Icon"
              />
              <TransparentPasswordInput
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current Password"
              />
            </InputGroup>
            <InputGroup marginTop="5%">
              <Icon
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf7ac098f5db87311adb5bb39ad666714d75de6cb890f8468d9b4fea61602d32?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
                alt="Password Icon"
              />
              <TransparentPasswordInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
              />
            </InputGroup>
            <ButtonWrapper>
              <Button onClick={updateAccount}>Update Account</Button>
            </ButtonWrapper>
          </div>
          <InfoText onClick={() => onClose()}>Close</InfoText>
        </Card>
      </Container>
    </SignupForm>
  );
};

const InfoText = styled.p`
  color: #525252;
  text-align: center;
  align-self: center;
  margin-top: 10px;
  font: 14px Poppins, sans-serif;
  cursor: pointer;
`;

const SignupForm = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
`;

const Container = styled.section`
  border-radius: 40px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(223, 219, 233, 0.4);
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #1c1c1c;
  font-weight: 400;
  justify-content: center;
  padding: 34px 31px;
  @media (max-width: 991px) {
    padding: 15px 15px;
  }
  animation: fadeInDown 0.5s ease-out forwards;

  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Card = styled.div`
  border-radius: 38px;
  background-color: rgba(254, 254, 255, 0.5);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  padding: 25px 50px 25px 50px;
  max-height: 90vh;
  overflow: auto;
  @media (max-width: 991px) {
    max-width: 100%;
    padding: 0 20px;
  }
`;

const Title = styled.h1`
  color: #000;
  text-align: center;
  text-transform: uppercase;
  align-self: center;
  font: 30px Quantico, sans-serif;
`;

const Subtitle = styled.p`
  color: #525252;
  text-align: center;
  align-self: center;
  margin: 20px 0 0px 0;
  font: 15px Poppins, sans-serif;
`;

const InputGroup = styled.div`
  border-radius: 16px;
  background-color: rgba(240, 237, 255, 0.8);
  display: flex;
  gap: 6px;
  white-space: nowrap;
  padding: 14px 18px;
  @media (max-width: 991px) {
    white-space: initial;
  }
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : "0")};
`;

const TransparentInput = styled.input.attrs({ type: "text" })`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  &:focus {
    border-bottom: 1px solid #ccc; // Optional: Adds focus indicator
  }
`;

const TransparentPasswordInput = styled.input.attrs({ type: "password" })`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  &:focus {
    border-bottom: 1px solid #ccc; // Optional: Adds focus indicator
  }
`;

const Icon = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 24px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Button = styled.button`
  font-family: Poppins, sans-serif;
  border-radius: 16px;
  background: linear-gradient(100deg, #9181f4 -5.85%, #5038ed 109.55%);
  box-shadow: 0px 8px 21px 0px rgba(0, 0, 0, 0.16);
  align-self: center;
  margin-top: 29px;
  color: #fff;
  font-weight: 700;
  text-align: center;
  justify-content: center;
  padding: 20px 39px;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 20px;
  }
`;

export default AccountManagement;
