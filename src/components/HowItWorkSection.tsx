
import useScrollAnimation from "../hooks/useScrollAnimation";
import { ArrowRight } from "lucide-react";
export default function HowItWorksSection() {
  const isVisible = useScrollAnimation();

  const steps = [
    { step: "01", title: "Share Your Idea", desc: "Post your project concept with details, goals, and requirements" },
    { step: "02", title: "Get Validated", desc: "Community votes and provides feedback on viability and potential" },
    { step: "03", title: "Build Your Team", desc: "Connect with skilled collaborators who want to join your vision" },
    { step: "04", title: "Make It Real", desc: "Track progress, collaborate, and launch your project successfully" }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-linear-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">Simple steps to bring your ideas to life</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              <div 
                id={`step-${index}`}
                className={`animate-on-scroll ${isVisible[`step-${index}`] ? 'visible' : ''} bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="text-5xl font-bold text-purple-200 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-purple-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
