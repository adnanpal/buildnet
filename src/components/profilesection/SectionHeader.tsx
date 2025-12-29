interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  bgColor: string; 
}
function SectionHeader({ icon, title, bgColor }:SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`${bgColor} p-2 rounded-lg`}>
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
  );
}
export default SectionHeader;