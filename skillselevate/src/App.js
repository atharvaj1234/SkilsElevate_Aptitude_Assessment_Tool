import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import TestPage from './Test';
import Practice from './Practice';
import Assesment from './Assesment';
import AddQuestionForm from './Upload'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LandingPage/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/test" element={<TestPage/>} />
        <Route path="/practice" element={<Practice/>} />
        <Route path="/admin" element={<AddQuestionForm/>} />
        <Route path="/Assesment" element={<Assesment/>} />
      </Routes>
    </Router>
  );
}

export default App;
