type FeatureCardProps = {
  feature: {
    color: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  index: number;
  isVisible: Record<string, boolean>;
};
export default function FeatureCard({ feature, index, isVisible }:FeatureCardProps) {
  return (
    <div 
      id={`feature-${index}`}
      className={`animate-on-scroll ${isVisible[`feature-${index}`] ? 'visible' : ''} bg-linear-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={`bg-linear-to-r ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6`}>
        {feature.icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
    </div>
  );

}