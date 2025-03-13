import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';  
import Home from './Components/Home';  
import About from './Components/Pages/About';
import Login from './Components/Pages/Login';    
import List from './Components/List/ListPage';  
import GetStarted from './Components/Pages/GetStarted';
import SinglePage from './Components/Pages/SinglePage';  
import ProfilePage from './Components/Pages/ProfilePage';
import ProfileUpdatePage from './Components/Pages/ProfileUpdatePage';
import NewPostPage from './Components/Pages/NewPostPage'; // ✅ Import the new post page
import AboutPage from './Components/Pages/AboutPage';
import { AuthContextProvider } from './Components/Context/AuthContext';
import Contact from './Components/Pages/Contact';
import ProtectedRoute from './Components/ProtectedRoute';
import ScrollToTop from "./Components/List/ScrollToTop";


const App = () => {
    
  
  return (
    <AuthContextProvider>
      <Router>
        <Navbar />
        <ScrollToTop />
        <div className="pt-12">  
          <Routes>
            {/* ✅ Home Page Route */}
            <Route path="/" element={<Home />} />

            {/* ✅ Public Routes */}
            <Route path="/login" element={<Login />} />    
            <Route path="/signup" element={<GetStarted />} />  
            <Route path="/about" element={<About />} />  
            <Route path="/contact" element={<Contact />} /> 
            <Route path="/aboutpage" element={<AboutPage />} /> 

            {/* ✅ Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } /> 

            <Route path="/profile/update" element={  
              <ProtectedRoute>  
                <ProfileUpdatePage />  
              </ProtectedRoute>  
            } />  

            <Route path="/property" element={
              <ProtectedRoute>
                <List />
              </ProtectedRoute>
            } />  

            <Route path="/property/:id" element={
              <ProtectedRoute>
                <SinglePage />
              </ProtectedRoute>
            } />  

            {/* ✅ New Post Route */}
            <Route path="/new-post" element={
              <ProtectedRoute>
                <NewPostPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
