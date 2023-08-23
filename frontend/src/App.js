import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login'
import Home from './Components/Home';
import Loading from './Components/Loading';
const Form = React.lazy(() => import("./Components/Form"));
const MainPage = React.lazy(() => import("./Components/MainPage"))

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/home' element={<MainPage />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/user/:_id' element={<Form />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
