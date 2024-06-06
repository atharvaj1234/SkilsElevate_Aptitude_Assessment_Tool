import { React } from 'react';
import styled from "styled-components";
import {  useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

function LoginOverlay({ onClose }) {
  
  const { setUser, setProfile } = useAuth();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setUser(codeResponse);
      try {
        const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
          headers: {
            Authorization: `Bearer ${codeResponse.access_token}`,
            Accept: 'application/json',
          },
        });
        setProfile(res.data);
        navigate('/dashboard');
      } catch (err) {
        console.log(err);
      }
    },
    onError: (error) => console.log('Login Failed:', error),
  });
  
  return (
      <LoginForm>
        <Container>
          <Card>
            <div display="flex">
              <Title>Login</Title>
              <Subtitle>Log in to your SkillElevate account to continue</Subtitle>
              <form>
                <InputGroup marginTop="5%">
                  <Icon
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/0a592f3e6a871ed42db10bc4b9f20d0695722c54d3a3fcd5c1e267f84847048a?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
                    alt="User Icon"
                    />
                  <TransparentInput type="text" id="username" placeholder="Username" />
                </InputGroup>
                <InputGroup marginTop="5%">
                  <Icon
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/cf7ac098f5db87311adb5bb39ad666714d75de6cb890f8468d9b4fea61602d32?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
                    alt="Password Icon"
                    />
                  <TransparentInput type="password" id="password" placeholder="Enter your password" />
                </InputGroup>
                <ButtonWrapper>
                  <Button type="submit">Login</Button>
                </ButtonWrapper>
              </form>
              <Subtitle>Login with Others</Subtitle>
              <SocialButton marginTop="5%" onClick={login}>
                <SocialIcon
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f6d3d808ab4073688c4ad1c7066eb7286e3889dc42405f8a6653ac235230880a?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
                  alt="Google Icon"
                  />
                <SocialLabel>Continue with Google</SocialLabel>
              </SocialButton>
              <SocialButton marginTop="5%">
                <SocialIcon
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5fa1c4da0ef6638f7c37245831233436c9b89959a8b6fc18b5f60c5ffba227e?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
                  alt="LinkedIn Icon"
                />
                <SocialLabel>Continue with LinkedIn</SocialLabel>
              </SocialButton>
              <InfoText>Don't have an account? 
              {/* eslint-disable-next-line */}
                <a onClick={onClose}> Signup</a>
              </InfoText>
            </div>
          </Card>
        </Container>
      </LoginForm>
  );
}

const LoginForm = styled.div`
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
    padding: 0 20px;
  }
  animation: fade 0.3s ease-out forwards;

  @keyframes fade{
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
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

const TransparentInput = styled.input.attrs({ type: 'text' })`
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

const SocialButton = styled.div`
  border-radius: 16px;
  border: 1px solid rgba(112, 112, 114, 1);
  display: flex;
  gap: 6px;
  text-align: center;
  align-self: center;
  padding: 11px 80px;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 20px;
  }
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : "0")};
`;

const SocialIcon = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 30px;
`;

const SocialLabel = styled.div`
  font-family: Poppins, sans-serif;
  margin: auto 0;
`;

const InfoText = styled.p`
  color: #525252;
  text-align: center;
  align-self: center;
  margin-top: 10px;
  font: 14px Poppins, sans-serif;
  cursor: pointer;
`;

export default LoginOverlay;
