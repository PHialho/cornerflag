import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColorClass?: string;
  iconBgClass?: string;
  valueColorClass?: string;
  badgeText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconColorClass = 'text-emerald-400',
  iconBgClass = 'bg-emerald-500/10 border-emerald-500/20',
  valueColorClass = 'text-white',
  badgeText,
}) => {
  return (
    <div className="bg-[#121721] border border-[#1E2638] p-5 rounded-2xl relative overflow-hidden transition-all hover:border-[#2A364F]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-400">{title}</p>
          <h3 className={`text-2xl font-black mt-1 tracking-tight font-mono ${valueColorClass}`}>
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl border ${iconBgClass}`}>
          <Icon className={`w-5 h-5 ${iconColorClass}`} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs">
        {subtext && <p className="text-gray-500">{subtext}</p>}
        {badgeText && (
          <span className="bg-[#0B0E14] text-gray-400 border border-[#1E2638] px-2 py-0.5 rounded text-[10px] font-mono">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
