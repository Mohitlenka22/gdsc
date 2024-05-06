import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Home from './Components/Home';
import Loading from './Components/Loading';
import Otp from './Components/Otp';
import MemberLogin from './Components/MemberLogin';
import Approve from './Components/Approve';
import Reject from './Components/Reject';
import Project from './Components/Project';
import MemberDashBoard from './Components/MemberDashBoard';
import Signup from './Components/Signup';

const Form = React.lazy(() => import('./Components/Form'));
const MainPage = React.lazy(() => import('./Components/MainPage'));

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/dashboard/:projectName/:_id" element={<MainPage />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/user/:project/:_id" element={<Form />} />
            <Route exact path="/user/:view/:_id" element={<Form />} />
            <Route exact path="/otp" element={<Otp />} />
            <Route exact path="/member" element={<MemberLogin />} />
            <Route exact path="/approve/:member_id/:project_id" element={<Approve />} />
            <Route exact path="/reject/:member_id" element={<Reject />} />
            <Route exact path="/projects" element={<Project />} />
            <Route exact path="/member/dashboard" element={<MemberDashBoard />} />
            <Route exact path="/signup" element={<Signup />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
