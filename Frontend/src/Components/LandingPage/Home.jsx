import React from "react";
import Header from "./Header";
import About from "../Pages/About";
import RecentProjects from "../Pages/RecentProjects";
import Contact from "../Pages/Contact";
import Footer from "./Footer";

const Home = () => {
  return (
    <div id="home">  
      <Header />
      <About />
      <RecentProjects />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;