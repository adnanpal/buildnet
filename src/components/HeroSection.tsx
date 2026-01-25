import { ArrowRight, PlusIcon } from 'lucide-react';
import useTextRotation from "../hooks/useTextRotation";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const rotatingTexts = [
    'Reality',
    'Success Stories',
    'Revolutionary Products',
    'Dream Projects',
    'Innovative Solutions'
  ];

  const { currentText, currentIndex } = useTextRotation(rotatingTexts);
  const navigate = useNavigate();
  const isBuild = () => navigate("/sign-in");

  return (
    <section className="pt-32 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background circles - hidden on mobile for better performance */}
      <div className="hero-bg-circle absolute top-20 left-10 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-300 opacity-30" style={{ animationDelay: '0s' }}></div>
      <div className="hero-bg-circle absolute bottom-20 right-10 w-60 sm:w-72 md:w-80 h-60 sm:h-72 md:h-80 bg-blue-300 opacity-30" style={{ animationDelay: '2s' }}></div>
      <div className="hero-bg-circle absolute top-40 right-1/4 w-64 h-64 bg-pink-300 opacity-20" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
       
        <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 rounded-full text-purple-700 text-xs sm:text-sm font-semibold floating">
          🚀 Launch Your Ideas with Confidence
        </div>

      
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
          Turn Your Ideas Into
          <br />
          <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent inline-block text-rotate-enter" key={currentIndex}>
            {currentText}
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto px-4">
          Shared your project ideas, get community validation, find collaborators, and build something amazing together. Your next breakthrough starts here.
        </p>

    
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center max-w-xl mx-auto mb-6 sm:mb-8 px-4">
          <button 
            onClick={isBuild}
            className="w-full sm:w-auto bg-linear-to-br from-rose-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            Build Project
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button 
            onClick={isBuild}
            className="w-full sm:w-auto bg-linear-to-r from-purple-600 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

      
      </div>
    </section>
  );
}