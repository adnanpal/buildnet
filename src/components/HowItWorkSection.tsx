import useScrollAnimation from "../hooks/useScrollAnimation";
import { ArrowRight, ArrowDown } from "lucide-react";

export default function HowItWorksSection() {
  const isVisible = useScrollAnimation();

  const steps = [
    { step: "01", title: "Share Your Idea", desc: "Post your project concept with details, goals, and requirements" },
    { step: "02", title: "Get Validated", desc: "Community votes and provides feedback on viability and potential" },
    { step: "03", title: "Build Your Team", desc: "Connect with skilled collaborators who want to join your vision" },
    { step: "04", title: "Make It Real", desc: "Track progress, collaborate, and launch your project successfully" }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-linear-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
            Simple steps to bring your ideas to life
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div 
                id={`step-${index}`}
                className={`animate-on-scroll ${isVisible[`step-${index}`] ? 'visible' : ''} bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-purple-200 mb-3 sm:mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Desktop Arrow (right) */}
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-purple-300" />
                </div>
              )}

              {/* Mobile Arrow (down) */}
              {index < 3 && (
                <div className="flex lg:hidden justify-center my-4">
                  <ArrowDown className="w-6 h-6 text-purple-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}