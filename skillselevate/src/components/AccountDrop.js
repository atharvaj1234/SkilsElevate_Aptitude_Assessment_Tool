import React, { useEffect, useState} from "react";
import styled from "styled-components";
import AccountManagement from "./AccountManagement";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


  const AccountDrop = ({ onClose }) => {
  // eslint-disable-next-line
  const [user, loading, error] = useAuthState(auth);
  const [showManageAccount , setShowManageAccount] = useState(false)
  let [data, setName] = useState("");
  
  const fetchUser = async () => {
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

  const handleCloseOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      setShowManageAccount(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [data, loading]);

  return (
    <>
     {showManageAccount && (
        <Overlay onClick={handleCloseOutsideClick}>
          <AccountManagement onClose={() => setShowManageAccount(false)}/>
        </Overlay>)}
      <Division>
        <ProfileImg onClick={onClose} loading="lazy" src={data.profilepicture} />
        <AccountOption onClick={()=>setShowManageAccount(true)}>
          <OptionText>Manage Account</OptionText>
          <OptionIcon
            loading="lazy"
            src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FIcons%2Fprofile.png?alt=media&token=855854d7-07f5-49cb-b44b-b75e4d2dffb2"
            alt="Manage Account Icon"
          />
        </AccountOption>
        <AccountOption onClick={logout}>
          <OptionText>Log Out</OptionText>
          <OptionIcon
            loading="lazy"
            src="https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2FIcons%2Flogout.png?alt=media&token=e86acdd0-b2aa-4d72-8659-1287d71ab3b3"
            alt="Log Out Icon"
          />
        </AccountOption>
      </Division>
    </>
  );
};

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
  align-items: bottom;
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
  background-image: url("https://firebasestorage.googleapis.com/v0/b/skillselevate.appspot.com/o/siteImages%2Faccountdropbg.svg?alt=media&token=ea1d2ec6-c958-4c2e-a343-64ef4e9cd77d");
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

export default AccountDrop;
