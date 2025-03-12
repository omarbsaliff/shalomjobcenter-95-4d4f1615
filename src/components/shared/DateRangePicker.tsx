
import React, { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/language";
import { format, isValid, parseISO } from "date-fns";

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
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setStartDate(newDate);
    
    // If end date is before new start date, update end date
    if (endDate && new Date(endDate) < new Date(newDate)) {
      setEndDate(newDate);
    }
  };

  // Format date for display if needed
  const formatDateString = (dateString: string): string => {
    try {
      if (!dateString) return '';
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'yyyy-MM-dd') : dateString;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="grid grid-cols-2 divide-x">
        <div className="p-3">
          <label className="block text-xs text-gray-500 mb-1">{t('ARRIVAL') || 'ARRIVÉE'}</label>
          <input
            type="date"
            className="w-full focus:outline-none text-sm"
            value={startDate}
            onChange={handleStartDateChange}
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

export default React.memo(DateRangePicker);
