import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";

export function Calendar() {
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date().getDate();
    const isCurrentMonth = 
      currentMonth.getMonth() === new Date().getMonth() &&
      currentMonth.getFullYear() === new Date().getFullYear();

    // Previous month days
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`prev-${i}`} className="text-gray-400 text-center py-1">
          {new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            0 - (startDay - i - 1)
          ).getDate()}
        </div>
      );
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected = i === selectedDate;
      const isToday = i === today && isCurrentMonth;
      days.push(
        <div
          key={i}
          onClick={() => setSelectedDate(i)}
          className={`text-center py-1 cursor-pointer ${
            isSelected 
              ? "bg-blue-500 text-white rounded-full" 
              : isToday 
                ? "text-blue-500 font-bold"
                : "text-gray-700"
          }`}
        >
          {i}
        </div>
      );
    }

    // Next month days
    const remainingDays = 42 - (days.length); // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <div key={`next-${i}`} className="text-gray-400 text-center py-1">
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold">
          {format(currentMonth, "MMMM")} <span className="text-blue-500">{format(currentMonth, "yyyy")}</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div key={day} className="text-gray-500 font-medium text-center py-1">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
}