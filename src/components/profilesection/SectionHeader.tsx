interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  bgColor: string;
  subtitle?: string;
}

function SectionHeader({ icon, title, bgColor, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className={`${bgColor} p-3 rounded-2xl shadow-sm shrink-0`}>
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export default SectionHeader;