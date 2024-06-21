import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  border-radius: 16px;
  background: linear-gradient(100deg, #9181f4 -5.85%, #5038ed 109.55%);
  box-shadow: 0px 8px 21px 0px rgba(0, 0, 0, 0.16);
  margin-top: 22px;
  width: 235px;
  max-width: 100%;
  color: #fff;
  text-align: center;
  justify-content: center;
  padding: 22px 60px;
  font-weight: 700;
  font-size: 12px;
  font-family: Poppins, sans-serif;
  white-space: nowrap;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 22px 20px;
    white-space: initial;
  }
`;

const Heading = styled.h1`
  color: #000;
  text-align: center;
  text-transform: uppercase;
  font-family: Quantico, sans-serif;
  font-weight: 700;
  font-size: 30px;
  margin: 0;
  @media (max-width: 991px) {
    font-size: 26px;
  }
`;

const SubHeading = styled.h2`
  color: #525252;
  text-align: center;
  font-family: Poppins, sans-serif;
  margin-top: 16px;
  @media (max-width: 991px) {
    font-size: 14px;
    margin-top: 10px;
  }
`;

const Section = styled.section`
  color: #525252;
  font-family: Poppins, sans-serif;
  margin-top: 67px;
  @media (max-width: 991px) {
    margin-top: 40px;
  }
  @media (max-width: 991px) {
    font-size: 14px;
  }
`;

const ExamButton = styled.button`
  border-radius: 16px;
  background-color: ${({ selected }) => (selected ? "#9181f4" : "#f0edff")};
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  font-family: Poppins, sans-serif;
  margin: 10px;
  padding: 22px 30px;
  cursor: pointer;
  @media (max-width: 991px) {
    padding: 22px 20px;
  }
`;

const ExamContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 13px 31px;
  justify-content: space-between;
  align-items: left;
  @media (max-width: 991px) {
    margin: 13px 20px;
  }
  @media (max-width: 991px) {
    justify-content: center;
  }
`;

const CustomExamInput = styled.input`
  border-radius: 10px;
  border: 2px solid black;
  background-color: #f0edff;
  font-family: Poppins, sans-serif;
  height: 30px;
  margin: 10px;
  padding: 12px 20px;
  border: none;
  outline: none;
  width: 50%;
`;

const Main = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  padding: 24px 71px 11px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(15px);
`;

function PersonlizeProfile({ onClose }) {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState("");
  const [customExamName, setCustomExamName] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const exams = ["UCO", "UIEO", "CAT", "MAT", "GATE", "Other"];
  let [data, setName] = useState("");
  
  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [data, loading]);

  if (error) console.log(error);
  
  const handleExamSelection = (exam) => {
    setSelectedExam(exam);
  };


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

  const updateExam = async () => {
    try {
      const userUID = user?.uid;
      const examValue =
        selectedExam === "Other" ? customExamName : selectedExam;

      const usersCollectionRef = collection(db, "users");
      const userDocQuery = await getDocs(
        query(usersCollectionRef, where("uid", "==", userUID))
      );

      if (!userDocQuery.empty) {
        const userDocRef = userDocQuery.docs[0].ref;

        // Update the existing document with the selected exam
        await updateDoc(userDocRef, {
          exam: examValue,
        });
        console.log("User profile updated successfully");
        navigate("/test", { state: { testId: "demo" } })
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };


  return (
    <Main>
      <Heading>Help Us Personalize Your Experience</Heading>
      <SubHeading>This will help us to customize your profile</SubHeading>
      <Section>Which Exam are you aiming to prepare for</Section>
      <ExamContainer>
        {exams.map((exam) => (
          <ExamButton
            key={exam}
            onClick={() => handleExamSelection(exam)}
            selected={selectedExam === exam}
          >
            {exam}
          </ExamButton>
        ))}
      </ExamContainer>
      {selectedExam === "Other" && (
        <CustomExamInput
          placeholder="Enter exam name"
          value={customExamName}
          onChange={(e) => setCustomExamName(e.target.value)}
        />
      )}
      <Button onClick={() => updateExam()}>Next</Button>
    </Main>
  );
}

export default PersonlizeProfile;
