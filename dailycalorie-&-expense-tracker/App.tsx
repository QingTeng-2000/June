
import React, { useState, useEffect, useMemo } from 'react';
import Calendar from './components/Calendar';
import DayDetail from './components/DayDetail';
import AnalysisView from './components/AnalysisView';
import { DailyData, ViewState, ConsumptionItem } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [allData, setAllData] = useState<Record<string, DailyData>>({});
  
  useEffect(() => {
    const saved = localStorage.getItem('daily_consumption_data_v2');
    if (saved) {
      try { setAllData(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('daily_consumption_data_v2', JSON.stringify(allData));
  }, [allData]);

  const dateKey = selectedDate.toISOString().split('T')[0];
  const currentDayData = allData[dateKey] || { date: dateKey, items: [] };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('dayDetail');
  };

  const handleUpdateItems = (items: ConsumptionItem[]) => {
    setAllData(prev => ({ ...prev, [dateKey]: { ...currentDayData, items } }));
  };

  const stats = useMemo(() => {
    const values = Object.values(allData) as DailyData[];
    const total = values.reduce((acc, day) => 
      acc + day.items.reduce((sum, item) => sum + item.amount, 0), 0
    );
    return { total, daysTracked: values.length };
  }, [allData]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#f2f2f7] overflow-hidden relative safe-area-pb">
      <div className="h-10 bg-[#f2f2f7] shrink-0 safe-area-pt"></div>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24 pwa-only-pt">
        {currentView === 'calendar' && (
          <div className="p-5 space-y-6">
            <header className="flex justify-between items-start px-1">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">消耗日历</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  累计消耗 <span className="text-blue-600 font-bold">{stats.total.toLocaleString()}</span>
                </p>
              </div>
              <button 
                onClick={() => setCurrentView('analysis')}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-xs font-bold active-scale transition-all shadow-lg shadow-blue-200"
              >
                数据统计
              </button>
            </header>
            
            <div className="bg-white rounded-[2.5rem] p-5 ios-shadow">
              <Calendar allData={allData} onDayClick={handleDayClick} selectedDate={selectedDate} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-[2rem] ios-shadow">
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-wider">记录时长</p>
                <p className="text-2xl font-black text-gray-900">{stats.daysTracked} <span className="text-sm font-normal text-gray-400">天</span></p>
              </div>
              <div className="bg-white p-5 rounded-[2rem] ios-shadow">
                <p className="text-[10px] text-gray-400 font-black uppercase mb-1 tracking-wider">日均消耗</p>
                <p className="text-2xl font-black text-gray-900">{stats.daysTracked ? (stats.total / stats.daysTracked).toFixed(0) : 0}</p>
              </div>
            </div>
          </div>
        )}

        {currentView === 'dayDetail' && (
          <DayDetail 
            date={selectedDate} 
            data={currentDayData} 
            onBack={() => setCurrentView('calendar')} 
            onUpdate={handleUpdateItems} 
          />
        )}

        {currentView === 'analysis' && (
          <AnalysisView 
            allData={Object.values(allData) as DailyData[]} 
            onBack={() => setCurrentView('calendar')} 
          />
        )}
      </main>

      <nav className="absolute bottom-0 left-0 right-0 h-24 ios-blur border-t border-gray-100 flex justify-around items-center px-10 pb-8 z-50">
        <button 
          onClick={() => setCurrentView('calendar')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${currentView === 'calendar' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/></svg>
          <span className="text-[10px] font-bold">日历</span>
        </button>
        <button 
          onClick={() => setCurrentView('analysis')} 
          className={`flex flex-col items-center gap-1.5 transition-all ${currentView === 'analysis' ? 'text-blue-600 scale-110' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-10 14H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
          <span className="text-[10px] font-bold">统计</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
