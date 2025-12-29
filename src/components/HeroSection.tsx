import {  ArrowRight, Check,PlusIcon } from 'lucide-react';
import useTextRotation from "../hooks/useTextRotation";

import { useNavigate } from "react-router-dom";


export default function HeroSection(){
  

    const rotatingTexts = [
        'Reality',
        'Success Stories',
        'Revolutionary Products',
        'Dream Projects',
        'Innovative Solutions'
    ];

    const {currentText,currentIndex} = useTextRotation(rotatingTexts);

    

      const navigate = useNavigate();
      const isBuild = ()=>navigate("/sign-in");
    
    return(

   <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="hero-bg-circle absolute top-20 left-10 w-96 h-96 bg-purple-300 opacity-30" style={{ animationDelay: '0s' }}></div>
      <div className="hero-bg-circle absolute bottom-20 right-10 w-80 h-80 bg-blue-300 opacity-30" style={{ animationDelay: '2s' }}></div>
      <div className="hero-bg-circle absolute top-40 right-1/4 w-64 h-64 bg-pink-300 opacity-20" style={{ animationDelay: '4s' }}></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-semibold floating">
          🚀 Launch Your Ideas with Confidence
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Turn Your Ideas Into
          <br />
          <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent inline-block text-rotate-enter" key={currentIndex}>
            {currentText}
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Shared your project ideas, get community validation, find collaborators, and build something amazing together. Your next breakthrough starts here.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto mb-8">
          <button 
            onClick={isBuild}
            className="w-full sm:w-auto bg-linear-to-br from-rose-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center gap-2 text-lg"
          >
            Build Project
            <PlusIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={isBuild}
            className="w-full sm:w-auto bg-linear-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition flex items-center justify-center gap-2 text-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>Free Forever</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>No Credit Card</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>Join 10K+ Innovators</span>
          </div>
        </div>
      </div>
    </section>
    );
}