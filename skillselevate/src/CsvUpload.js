import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import Papa from "papaparse";
import { query, collection, getDocs, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "skillselevate.firebaseapp.com",
  projectId: "skillselevate",
  storageBucket: "skillselevate.appspot.com",
  messagingSenderId: "379503586222",
  appId: "1:379503586222:web:f6d2190ec71439026d763f",
  measurementId: "G-WHW2NE1HRP",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AdminPage = () => {
  const navigate= useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);
  const [data, setData] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [exam, setExam] = useState("");
  const [testid, setTestid] = useState("");
  const [category, setCategory] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    {
      question: "",
      correctanswer: "",
      category: "",
      options: [
        { label: "A", text: "" },
        { label: "B", text: "" },
        { label: "C", text: "" },
        { label: "D", text: "" },
      ],
    },
  ]);

  useEffect(() => {
    document.title = "SkillsElevate - Admin"
    if (loading) return;
    if (!user) return navigate("/");
    if (error) console.log(error);

    const fetchUser = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setData(data);
        if (data.role === "admin") {
          setShowDashboard(true);
        } else {
          alert("Unauthorized Attempt to Access")
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [user, loading]);


  const difficultyLevels = ["Easy", "Medium", "Hard"];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        processCSVData(results.data);
      },
    });
  };

  const processCSVData = (data) => {
    const questions = data.map((row) => ({
      question: row.question,
      correctanswer: row.correctanswer,
      category: row.questionCategory,
      options: [
        { label: "A", text: row.optionA },
        { label: "B", text: row.optionB },
        { label: "C", text: row.optionC },
        { label: "D", text: row.optionD },
      ],
    }));
    setExam(data[0].exam);
    setTestid(data[0].testid);
    setTitle(data[0].title);
    setCategory(data[0].testCategory);
    setDifficultyLevel(data[0].difficultyLevel);
    setTime(data[0].time);
    setQuestions(questions);
  };

  const handleInputChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        correctanswer: "",
        category: "",
        options: [
          { label: "A", text: "" },
          { label: "B", text: "" },
          { label: "C", text: "" },
          { label: "D", text: "" },
        ],
      },
    ]);
  };

  const updateDatabase = async () => {
    try {
      const docRef = doc(db, "tests", exam);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = {
          [testid]: {
            category,
            difficultyLevel,
            time,
            title,
            question: questions,
          },
        };
        await updateDoc(docRef, data);
        alert("Document successfully updated!");
      } else {
        alert("No such document!");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (showDashboard && (
    <div>
      <h1>Admin Page</h1>
      <div>
        <label>
          Upload CSV:
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </label>
      </div>
      <div>
        <label>
          Exam:
          <input
            type="text"
            value={exam}
            onChange={(e) => {setExam(e.target.value);}}
          />
        </label>
      </div>
      <div>
        <label>
          TestID:
          <input
            type="text"
            value={testid}
            onChange={(e) => setTestid(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Test Title:
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          >
          </input>
        </label>
      </div>
      <div>
        <label>
          Test Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Difficulty Level:
          <select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
          >
            <option value="">Select Difficulty Level</option>
            {difficultyLevels.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Time (in minutes):
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
      </div>
      {questions.map((q, qIndex) => (
        <div key={qIndex}>
          <div>
            <label>
              Question:
              <input
                type="text"
                style={{width:'100%'}}
                value={q.question}
                onChange={(e) =>
                  handleInputChange(qIndex, "question", e.target.value)
                }
              />
            </label>
          </div>
          <div>
            <label>
              Question Category:
              <input
                type="text"
                style={{width:'100%'}}
                value={q.category}
                onChange={(e) =>
                  handleInputChange(qIndex, "category", e.target.value)
                }
              />
            </label>
          </div>
          <div>
            <label>
              Correct Answer:
              <select
                value={q.correctanswer}
                onChange={(e) =>
                  handleInputChange(qIndex, "correctanswer", e.target.value)
                }
              >
                <option value="">Select Answer</option>
                {q.options.map((option, oIndex) => (
                  <option key={oIndex} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {q.options.map((option, oIndex) => (
            <div key={oIndex}>
              <label>
                Option {option.label}:
                <input
                  type="text"
                  style={{width:'100%'}}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                />
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={updateDatabase}>Update Database</button>
    </div>)
  );
};

export default AdminPage;
