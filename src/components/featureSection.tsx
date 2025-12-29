import useScrollAnimation from "../hooks/useScrollAnimation";
import { Lightbulb, Users, TrendingUp, Shield, Award, MessageSquare} from 'lucide-react';
import FeatureCard from "./featureCard";

export default function FeaturesSection() {
  const isVisible = useScrollAnimation();

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Community Voting",
      description: "Get real-time feedback and validation from a community of innovators and experts",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Find Collaborators",
      description: "Connect with developers, designers, and entrepreneurs who share your vision",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Idea Protection",
      description: "Timestamp tracking and privacy controls to protect your intellectual property",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Feedback System",
      description: "Receive constructive feedback and suggestions to refine your ideas",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Recognition & Rewards",
      description: "Earn badges, reputation points, and get featured for your contributions",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Project Tracking",
      description: "Track your journey from idea to launch with comprehensive analytics",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From idea validation to team building, we've got you covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
