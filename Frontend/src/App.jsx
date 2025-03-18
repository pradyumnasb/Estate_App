import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/LandingPage/Navbar";
import Home from "./Components/LandingPage/Home";
import About from "./Components/Pages/About";
import Login from "./Components/RegisterAuth/Login";
import List from "./Components/ProjectPage/ListPage";
import GetStarted from "./Components/RegisterAuth/GetStarted";
import SinglePage from "./Components/ProjectPage/SinglePage";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
import ProfileUpdatePage from "./Components/ProfilePage/ProfileUpdatePage";
import NewPostPage from "./Components/ProjectPage/NewPostPage";
import AboutPage from "./Components/Pages/AboutPage";
import { AuthContextProvider, AuthContext } from "./Components/Context/AuthContext";
import Contact from "./Components/Pages/Contact";
import ProtectedRoute from "./Components/ProtectedRoute";
import ScrollToTop from "./Components/List/ScrollToTop";
import WorkerRegister from "./Components/RegisterAuth/WorkerRegister";
import HireWorkerPage from "./Components/Pages/HireWorkerPage";
import { NotificationProvider } from "./Components/Context/NotificationContext";

const AppContent = () => {
  const { currentUser } = useContext(AuthContext);
  if (!currentUser) {
    console.log("⏳ Waiting for user authentication...");
    return <div>Loading...</div>;
  }

  const workerId = currentUser?.role === "worker" ? currentUser._id : null;
  console.log("👤 Current User:", currentUser);
  console.log("🆔 Worker ID:", workerId);

  return (
    <NotificationProvider workerId={workerId}>
      <Router>
        <Navbar />
        <ScrollToTop />
        <div className="pt-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<GetStarted />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/aboutpage" element={<AboutPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/update"
              element={
                <ProtectedRoute>
                  <ProfileUpdatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property"
              element={
                <ProtectedRoute>
                  <List />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property/:id"
              element={
                <ProtectedRoute>
                  <SinglePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-post"
              element={
                <ProtectedRoute>
                  <NewPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register-worker"
              element={
                <ProtectedRoute>
                  <WorkerRegister />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker-page"
              element={
                <ProtectedRoute>
                  <HireWorkerPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
};

const App = () => (
  <AuthContextProvider>
    <AppContent />
  </AuthContextProvider>
);

export default App;
