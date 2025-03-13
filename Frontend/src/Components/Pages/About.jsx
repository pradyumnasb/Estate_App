import React from "react";
import { Award, Home, Users, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="px-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto text-center py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Why Choose{" "}
          <span className="text-blue-600 dark:text-blue-400">LuxuryEstates</span>?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12">
          We specialize in delivering premium real estate services, ensuring an effortless and luxurious experience 
          for our clients. With our expertise, you gain access to the best properties and dedicated professionals 
          to guide you every step of the way.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Premium Properties */}
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex justify-center mb-4">
              <Home className="h-14 w-14 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Premium Properties
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access to exclusive high-end properties in the most desirable locations worldwide.
            </p>
          </div>

          {/* Expert Agents */}
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex justify-center mb-4">
              <Users className="h-14 w-14 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Expert Agents
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our professional agents are dedicated to providing expert advice and personalized service.
            </p>
          </div>

          {/* Trusted Service */}
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex justify-center mb-4">
              <Award className="h-14 w-14 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Trusted Service
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              With over 15 years of experience, we are a name you can trust in luxury real estate.
            </p>
          </div>

          {/* Secure & Transparent Deals */}
          <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="h-14 w-14 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure & Transparent Deals
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We ensure 100% secure transactions with complete transparency at every stage.
            </p>
          </div>
        </div>

        {/* Learn More Button */}
        <div className="mt-12">
          <button
            onClick={() => navigate("/aboutpage")}
            className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Learn More About Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
