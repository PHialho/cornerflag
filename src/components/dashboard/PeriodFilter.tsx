import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ArrowRight, ChevronDown } from 'lucide-react';
import { PERIOD_OPTIONS, type PeriodType, type DateRange } from '../../lib/utils/period';

interface PeriodFilterProps {
  selectedPeriod: PeriodType;
  onChangePeriod: (period: PeriodType) => void;
  customRange: DateRange;
  onChangeCustomRange: (range: DateRange) => void;
}

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onChangePeriod,
  customRange,
  onChangeCustomRange,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExplicitlyOpen, setIsExplicitlyOpen] = useState(false);
  const customContainerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customContainerRef.current &&
        !customContainerRef.current.contains(event.target as Node)
      ) {
        setIsExplicitlyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPopoverVisible = isHovered || isExplicitlyOpen;

  const handleCustomButtonClick = () => {
    onChangePeriod('CUSTOM');
    setIsExplicitlyOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-flex items-center gap-2.5 bg-[#121721] border border-[#1E2638] p-1.5 px-3 rounded-2xl flex-nowrap overflow-visible max-w-full">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 shrink-0">
        <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
        <span className="hidden sm:inline">Período:</span>
      </div>

      <div className="flex items-center gap-1 bg-[#0B0E14] p-1 rounded-xl border border-[#1E2638] shrink-0">
        {PERIOD_OPTIONS.map((opt) => {
          const isActive = selectedPeriod === opt.id;
          const isCustom = opt.id === 'CUSTOM';

          if (isCustom) {
            return (
              <div
                key={opt.id}
                ref={customContainerRef}
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <button
                  onClick={handleCustomButtonClick}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-gray-950 shadow-sm font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-[#121721]'
                  }`}
                >
                  <span>
                    {isActive && customRange.startDate && customRange.endDate
                      ? `Personalizado (${customRange.startDate} a ${customRange.endDate})`
                      : opt.label}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPopoverVisible ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Popover Container with padding-top bridge to prevent hover loss */}
                {isPopoverVisible && (
                  <div className="absolute right-0 top-full pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-[#121721] border border-[#1E2638] p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center gap-3 text-xs whitespace-nowrap">
                      <span className="text-gray-400 text-xs font-medium">Escolher datas:</span>

                      <div className="flex items-center gap-2 bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 rounded-xl">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 text-[11px] font-medium">De:</span>
                          <input
                            type="date"
                            value={customRange.startDate}
                            onChange={(e) => {
                              onChangePeriod('CUSTOM');
                              onChangeCustomRange({ ...customRange, startDate: e.target.value });
                            }}
                            className="bg-[#121721] border border-[#1E2638] rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                          />
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />

                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400 text-[11px] font-medium">Até:</span>
                          <input
                            type="date"
                            value={customRange.endDate}
                            onChange={(e) => {
                              onChangePeriod('CUSTOM');
                              onChangeCustomRange({ ...customRange, endDate: e.target.value });
                            }}
                            className="bg-[#121721] border border-[#1E2638] rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={opt.id}
              onClick={() => {
                onChangePeriod(opt.id);
                setIsExplicitlyOpen(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-gray-950 shadow-sm font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-[#121721]'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
