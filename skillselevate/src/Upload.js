// src/AdminPage.js
import React, { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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
  const [exam, setExam] = useState("");
  const [testid, setTestid] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([""]);
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

  const setcat = () => {
    const filter = Category.filter(
      (category) => category.Exam.toLowerCase() === exam.toLowerCase()
    );
    if (Object.keys(filter).length === 0) {
      setCategories(Category[0].Category);
    } else setCategories(filter[0].Category);
  };

  const Category = [
    {
      Exam: "Default",
      Category: [
        "Logical Reasoning",
        "Mathematical Aptitude",
        "General Knowledge",
        "Verbal Ability",
      ],
    },
    {
      Exam: "MAT",
      Category: [
        "Language Comprehension",
        "Data Analysis & Sufficiency",
        "Mathematical Skills",
        "Intelligence & Critical Reasoning",
        "Indian & Global Environment",
      ],
    },
    {
      Exam: "CAT",
      Category: [
        "Verbal Ability",
        "Reading Comprehension",
        "Quantitative Ability",
        "Data Interpretation",
        "Logical Reasoning",
      ],
    },
    {
      Exam: "UCO",
      Category: [
        "English language",
        "General Awareness",
        "Reasoning",
        "Computer Aptitude",
        "Data Interpretation",
        "Analysis",
      ],
    },
    {
      Exam: "UIEO",
      Category: [
        "Vocabulary",
        "Functional Grammer",
        "Reading Comprehension",
        "Interactive English",
      ],
    },
    {
      Exam: "GATE",
      Category: [
        "Toughest Logical Reasoning",
        "Mathematical Aptitude",
        "Quantitative Ability",
        "General Knowledge",
        "Verbal Ability",
      ],
    },
  ];

  const difficultyLevels = ["Easy", "Medium", "Hard"];

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

  return (
    <div>
      <h1>Admin Page</h1>
      <div>
        <label>
          Exam:
          <input
            type="text"
            value={exam}
            onChange={(e) => setExam(e.target.value)}
          />
        </label>
        <button onClick={() => setcat()}>Find available categories</button>
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
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          <option value="Mock">Mock</option>
          </select>
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
              Category:
              <select
                value={q.category}
                onChange={(e) =>
                  handleInputChange(qIndex, "category", e.target.value)
                }
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
    </div>
  );
};

export default AdminPage;
