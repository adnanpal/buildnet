import { useState } from "react";
import { Lightbulb,Menu, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

interface NavbarProp{
  brand?:string;
}
export default function Navbar({brand="BuildNet"}:NavbarProp) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-3 left-4 right-4 max-w-6xl  rounded-2xl md:rounded-2xl lg:rounded-2xl  mx-auto bg-white/95 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-linear-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Lightbulb className="text-white  w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6"/>
            </div>
            <span className="font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-lg sm:text-xl md:text-2xl lg:text-2xl">
              {brand}
            </span>
          </div>
          
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-10">
            <a href="#features" className="font-normal text-gray-800 hover:text-purple-600 transition">Features</a>
            <a href="#how-it-works" className="font-normal text-gray-800 hover:text-purple-600 transition">How It Works</a>
            <a href="#community" className="font-normal text-gray-800 hover:text-purple-600 transition">Community</a>
          </div>
          <div  className="hidden md:flex ml-auto">
            <button 
            onClick={() => navigate("/sign-in?mode=signup")}
            className="text-[14px] font-medium bg-linear-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition">
              Sign Up
            </button>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg p-6 space-y-6 border border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-gray-700 hover:text-purple-600">Features</a>
            <a href="#how-it-works" className="block text-gray-700 hover:text-purple-600">How It Works</a>
            <a href="#community" className="block text-gray-700 hover:text-purple-600">Community</a>
            <button className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg" onClick={() => navigate("/sign-in?mode=signup")}>
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}