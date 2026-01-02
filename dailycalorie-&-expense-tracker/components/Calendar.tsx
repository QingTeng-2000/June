
import React, { useState } from 'react';
import { DailyData } from '../types';

interface CalendarProps {
  allData: Record<string, DailyData>;
  onDayClick: (date: Date) => void;
  selectedDate: Date;
}

const Calendar: React.FC<CalendarProps> = ({ allData, onDayClick, selectedDate }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));
  const daysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-14"></div>);

  const todayStr = new Date().toISOString().split('T')[0];

  for (let day = 1; day <= daysInMonth(viewDate.getMonth(), viewDate.getFullYear()); day++) {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = d.toISOString().split('T')[0];
    const total = allData[dateStr]?.items.reduce((acc, curr) => acc + curr.amount, 0) || 0;
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate.toISOString().split('T')[0];

    days.push(
      <button 
        key={day} 
        onClick={() => onDayClick(d)} 
        className={`h-16 w-full flex flex-col items-center justify-center rounded-2xl active-scale transition-all relative ${
          isSelected ? 'bg-blue-50 border-2 border-blue-600' : 
          isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-gray-50'
        }`}
      >
        <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>{day}</span>
        {total > 0 && (
          <span className={`text-[9px] font-black mt-0.5 truncate max-w-full px-1 ${isToday ? 'text-blue-100' : 'text-blue-600'}`}>
            {total > 999 ? (total/1000).toFixed(1)+'k' : total}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-xl font-black text-gray-900">{viewDate.getFullYear()}年 {viewDate.getMonth()+1}月</h2>
        <div className="flex gap-1.5">
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1))} className="p-2.5 bg-gray-50 rounded-xl active-scale">←</button>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1))} className="p-2.5 bg-gray-50 rounded-xl active-scale">→</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-300 mb-3">
        {['日','一','二','三','四','五','六'].map(d=><div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
};

export default Calendar;
