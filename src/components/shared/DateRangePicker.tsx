
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/language";

interface DateRangePickerProps {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  className?: string;
}

const DateRangePicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  className = "",
}: DateRangePickerProps) => {
  const { t } = useLanguage();
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="grid grid-cols-2 divide-x">
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-1">{t('ARRIVAL') || 'ARRIVÉE'}</label>
          <input
            type="date"
            className="w-full focus:outline-none text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={today}
          />
        </div>
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-1">{t('DEPARTURE') || 'DÉPART'}</label>
          <input
            type="date"
            className="w-full focus:outline-none text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || today}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
