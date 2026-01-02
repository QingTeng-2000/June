
import React, { useState, useEffect } from 'react';
import { DailyData, ConsumptionItem } from '../types';

interface DayDetailProps {
  date: Date;
  data: DailyData;
  onBack: () => void;
  onUpdate: (items: ConsumptionItem[]) => void;
}

const DayDetail: React.FC<DayDetailProps> = ({ date, data, onBack, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [exp, setExp] = useState('');
  const [calculatedVal, setCalculatedVal] = useState(0);

  useEffect(() => {
    try {
      // 仅保留数字和运算符，防止注入风险
      const cleanExp = exp.replace(/[^-+*/.0-9()]/g, '');
      if (cleanExp) {
        const result = new Function(`return ${cleanExp}`)();
        if (typeof result === 'number' && isFinite(result)) {
          setCalculatedVal(Math.round(result * 100) / 100);
        }
      } else {
        setCalculatedVal(0);
      }
    } catch (e) {
      // 忽略非法算式
    }
  }, [exp]);

  const addItem = () => {
    // 仅校验金额是否大于0
    if (calculatedVal <= 0) return;
    
    onUpdate([...data.items, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: name.trim() || '未命名', 
      amount: calculatedVal, 
      expression: exp.trim() || calculatedVal.toString(), // 保存原始算式
      category: '日常' 
    }]);
    setName(''); setExp(''); setCalculatedVal(0); setIsAdding(false);
  };

  const total = data.items.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="h-full bg-white flex flex-col animate-in slide-in-from-right duration-300">
      <div className="px-6 py-4 border-b flex justify-between items-center bg-white sticky top-0 z-10">
        <button onClick={onBack} className="text-blue-600 font-bold active-scale">返回</button>
        <span className="font-bold text-gray-900">{date.toLocaleDateString('zh-CN', {month: 'long', day: 'numeric'})}</span>
        <div className="w-10"></div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white mb-8 shadow-xl shadow-blue-100 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <p className="text-xs text-blue-100 font-black uppercase tracking-widest mb-1">今日消耗总计</p>
          <p className="text-5xl font-black">{total.toLocaleString()}</p>
        </div>

        {isAdding ? (
          <div className="bg-gray-50 p-6 rounded-[2.5rem] space-y-4 mb-8 border border-gray-100">
            <input 
              type="text" 
              placeholder="名称 (可选)" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              className="w-full p-4 rounded-2xl border-none outline-none ios-shadow text-gray-900 font-medium" 
            />
            <div className="relative">
              <input 
                type="text" 
                placeholder="算式 (如：20+35)" 
                value={exp} 
                onChange={e=>setExp(e.target.value)} 
                className="w-full p-4 rounded-2xl border-none outline-none ios-shadow font-mono text-gray-700" 
              />
              {calculatedVal > 0 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-black">
                  = {calculatedVal}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {['7','8','9','+','4','5','6','-','1','2','3','*','0','.','C','/'].map(c=>(
                <button 
                  key={c} 
                  onClick={()=>c==='C' ? setExp('') : setExp(p=>p+c)} 
                  className="h-12 bg-white rounded-2xl font-bold text-gray-800 active-scale shadow-sm flex items-center justify-center"
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={addItem} 
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black active-scale shadow-lg shadow-blue-100"
              >
                保存记录
              </button>
              <button 
                onClick={()=>setIsAdding(false)} 
                className="px-6 bg-gray-200 text-gray-600 py-4 rounded-2xl font-bold active-scale"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={()=>setIsAdding(true)} 
            className="w-full py-5 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-black active-scale hover:bg-gray-50 transition-colors mb-8"
          >
            + 添加一笔
          </button>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest px-1">记录详情</h3>
          {data.items.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">今日还没有记录哦</p>
          ) : (
            data.items.map(i=>(
              <div key={i.id} className="bg-white p-5 rounded-[1.5rem] flex justify-between items-center border border-gray-50 ios-shadow group">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-800 truncate">{i.name}</p>
                    {i.expression && i.expression !== i.amount.toString() && (
                      <p className="text-[10px] text-gray-400 font-mono truncate">{i.expression}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-black text-gray-900 text-lg">{i.amount.toLocaleString()}</span>
                  <button 
                    onClick={()=>onUpdate(data.items.filter(item=>item.id!==i.id))} 
                    className="text-gray-200 hover:text-red-500 active-scale"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DayDetail;
