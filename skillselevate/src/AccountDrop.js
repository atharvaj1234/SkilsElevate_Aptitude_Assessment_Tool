import * as React from "react";
import styled from "styled-components";

function AccountManagement({ onClose }) {
  return (<>
    {/* <StyledImage
        onClick={onClose}
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0d786e8d676d08614e99f0b77b83cfcd2f54fe4d1ff6183e645b3334c6243848?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
        alt="Background Image"
      /> */}
    <Division>
      <ProfileImg
        onClick={onClose}
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/2e252a24899c4fee4d3258724cd216b03a529cf4c92298570dc96b5ed13763f9?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
      />
      <AccountOption>
        <OptionText>Manage Account</OptionText>
        <OptionIcon
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec6e922e898daabb617ee3313a34d9067b38dce5370204d4371c5983e80b7af6?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
          alt="Manage Account Icon"
        />
      </AccountOption>
      <AccountOption>
        <OptionText>Log Out</OptionText>
        <OptionIcon
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c60dd956996710097d95b6e4530951f1e692c6584226a2bcab0e9e0798b81a9?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
          alt="Log Out Icon"
        />
      </AccountOption>
    </Division>
    </>
  );
}

const ProfileImg = styled.img`
  width: 60px;
  margin-left: 180px;
  margin-bottom:20px;
  @media (max-width: 991px) {
    width: 40px;
    margin-left: 119px;
    margin-top:3px;
    margin-bottom:10px;
  }
`;

const Division = styled.div`
  right:8px;
  top:15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  overflow: hidden;
  aspect-ratio: 1;
  position: fixed;
  font-size: 15px;
  color: #000;
  font-weight: 400;
  z-index: 3;
  width: 240px;
  background-repeat: round;
  background-image: url("https://cdn.builder.io/api/v1/image/assets/TEMP/0d786e8d676d08614e99f0b77b83cfcd2f54fe4d1ff6183e645b3334c6243848?apiKey=9fbb9e9d71d845eab2e7b2195d716278&");
  @media (max-width: 991px) {
    width: 160px;
    right:9px;
    top:2px;
  }
  `;

const AccountOption = styled.div`
  width: 160px;
  height: 25px;
  margin-left:25px;
  margin-top:5px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  gap: 13px;
  padding: 14px 15px;
  z-index: 3;
  align-items:center;
  @media (max-width: 991px) {
    width: 111px;
    height: 10px;
    margin-left:10px;
    margin-top:2px;
  }
`;

const OptionText = styled.p`
  font-family: Ruda, sans-serif;
  flex-grow: 1;
  z-index: 3;
  @media (max-width: 991px) {
    font-size: 11px;
  }
`;

const OptionIcon = styled.img`
  aspect-ratio: 1;
  width: 25px;
  object-fit: contain;
  object-position: center;
  z-index: 3;
  @media (max-width: 991px) {
    width: 16px;
  }
`;

export default AccountManagement;
