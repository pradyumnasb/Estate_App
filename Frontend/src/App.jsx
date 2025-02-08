import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';  
import Header from './Components/Header';
import Login from './Components/Login';    
import List from './Components/List/ListPage';  
import GetStarted from './Components/GetStarted';
import SinglePage from './Components/SinglePage';  // Import SinglePage
import ProfilePage from './Components/ProfilePage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="pt-12">  
        <Routes>
          <Route path="/" element={<Header />} />        
          <Route path="/login" element={<Login />} />    
          <Route path="/signup" element={<GetStarted />} />  
          <Route path="/list" element={<List />} />  
          <Route path="/:id" element={<SinglePage />} />
          <Route path="/profile" element={<ProfilePage />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
