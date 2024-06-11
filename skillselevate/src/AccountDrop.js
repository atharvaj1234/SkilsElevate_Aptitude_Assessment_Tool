import React, { useEffect, useState} from "react";
import styled from "styled-components";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


  const AccountManagement = ({ onClose }) => {
  // eslint-disable-next-line
  const [user, loading, error] = useAuthState(auth);
  let [data, setName] = useState("");
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
    fetchUserName();
    // eslint-disable-next-line
  }, [data, loading]);

  return (
    <>
      <Division>
        <ProfileImg onClick={onClose} loading="lazy" src={data.profilepicture} />
        <AccountOption>
          <OptionText>Manage Account</OptionText>
          <OptionIcon
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec6e922e898daabb617ee3313a34d9067b38dce5370204d4371c5983e80b7af6?apiKey=9fbb9e9d71d845eab2e7b2195d716278&"
            alt="Manage Account Icon"
          />
        </AccountOption>
        <AccountOption onClick={logout}>
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
};

const ProfileImg = styled(LazyLoadImage)`
  width: 60px;
  border-radius: 50%;
  margin-left: 180px;
  margin-bottom: 20px;
  cursor: pointer;
  @media (max-width: 991px) {
    width: 40px;
    margin-left: 119px;
    margin-top: 3px;
    margin-bottom: 10px;
  }
`;

const Division = styled.div`
  right: 8px;
  top: 15px;
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
    right: 9px;
    top: 2px;
  }
`;

const AccountOption = styled.div`
  width: 160px;
  height: 25px;
  margin-left: 25px;
  margin-top: 5px;
  border-radius: 10px;
  background-color: #fff;
  display: flex;
  gap: 13px;
  padding: 14px 15px;
  z-index: 3;
  align-items: center;
  cursor: pointer;
  @media (max-width: 991px) {
    width: 111px;
    height: 10px;
    margin-left: 10px;
    margin-top: 2px;
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
