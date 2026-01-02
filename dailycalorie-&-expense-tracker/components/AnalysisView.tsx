
import React, { useState, useMemo } from 'react';
import { DailyData } from '../types';

interface AnalysisViewProps {
  allData: DailyData[];
  onBack: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ allData, onBack }) => {
  const [note, setNote] = useState(() => localStorage.getItem('user_note_v2') || '');
  const [mathInput, setMathInput] = useState('');

  const stats15 = useMemo(() => {
    const sorted = [...allData].sort((a,b)=>new Date(a.date).getTime() - new Date(b.date).getTime());
    const periods = [];
    
    if (sorted.length === 0) return [];

    for(let i=0; i<sorted.length; i+=15) {
      const slice = sorted.slice(i, i+15);
      if (slice.length === 0) continue;
      periods.push({
        start: slice[0].date,
        end: slice[slice.length-1].date,
        total: slice.reduce((a,d)=>a+d.items.reduce((s,it)=>s+it.amount,0), 0),
        count: slice.length
      });
    }
    return periods.reverse();
  }, [allData]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    localStorage.setItem('user_note_v2', e.target.value);
  };

  return (
    <div className="h-full bg-[#f2f2f7] flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="px-6 py-4 bg-white/80 backdrop-blur-lg border-b flex justify-between items-center sticky top-0 z-10">
        <button onClick={onBack} className="text-blue-600 font-bold active-scale">关闭</button>
        <span className="font-bold text-gray-900">数据统计</span>
        <div className="w-10"></div>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto pb-32 no-scrollbar">
        {/* 15天周期汇总 */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 px-4 uppercase tracking-[0.2em]">15 天周期汇总</h3>
          {stats15.length === 0 ? (
            <div className="bg-white p-10 rounded-[2.5rem] text-center ios-shadow border border-white">
              <p className="text-gray-400 text-sm">暂无记录，快去开启你的第一天吧</p>
            </div>
          ) : (
            stats15.map((p, idx)=>(
              <div key={idx} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center ios-shadow border-l-[6px] border-blue-500 active-scale transition-all border border-white">
                <div>
                  <p className="text-[10px] font-bold text-blue-500 mb-1 uppercase tracking-widest font-mono">P-{stats15.length - idx}</p>
                  <p className="text-sm font-black text-gray-800">{p.start.split('-').slice(1).join('/')} - {p.end.split('-').slice(1).join('/')}</p>
                  <p className="text-[10px] text-gray-400 mt-1">包含 {p.count} 天记录</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-300 font-black uppercase mb-0.5">总消耗</p>
                  <p className="text-2xl font-black text-gray-900 leading-none">{p.total.toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 备忘录 */}
        <div className="bg-white p-6 rounded-[2.5rem] ios-shadow space-y-6 border border-white">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 bg-orange-400 rounded-full"></span>
            <h2 className="text-lg font-black text-gray-800 tracking-tight">随手笔记</h2>
          </div>
          <textarea 
            value={note} 
            onChange={handleNoteChange} 
            className="w-full h-32 p-5 bg-gray-50 rounded-[1.5rem] outline-none resize-none text-sm text-gray-700 font-medium border border-gray-100 focus:bg-white focus:border-blue-100 transition-all" 
            placeholder="写下你近期的目标或心得..."
          ></textarea>
        </div>

        {/* 快捷工具 */}
        <div className="bg-white p-6 rounded-[2.5rem] ios-shadow border border-white">
          <p className="text-[10px] font-black text-gray-300 mb-4 uppercase tracking-widest text-center">数值转换器</p>
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
             <span className="text-gray-400 font-bold">X=</span>
             <input 
              type="number" 
              value={mathInput} 
              onChange={e=>setMathInput(e.target.value)} 
              className="flex-1 bg-transparent outline-none font-mono text-lg font-bold text-gray-800" 
              placeholder="输入数值" 
            />
          </div>
          {mathInput && (
            <div className="grid grid-cols-2 gap-3 mt-4 animate-in fade-in zoom-in duration-300">
              <div className="bg-blue-50/50 p-4 rounded-2xl text-center border border-blue-50">
                <p className="text-[9px] text-blue-400 font-black uppercase mb-1">2^X</p>
                <p className="text-xl font-black text-blue-600">{Math.pow(2, Number(mathInput)).toLocaleString()}</p>
              </div>
              <div className="bg-orange-50/50 p-4 rounded-2xl text-center border border-orange-50">
                <p className="text-[9px] text-orange-400 font-black uppercase mb-1">X²</p>
                <p className="text-xl font-black text-orange-600">{Math.pow(Number(mathInput), 2).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
