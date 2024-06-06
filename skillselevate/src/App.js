import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import TestPage from './Test';
import Practice from './Practice';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" exact element={<LandingPage/>} />
        <Route path="/dashboard" element={ <ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/test" element={<TestPage/>} />
        <Route path="/practice" element={<Practice/>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
