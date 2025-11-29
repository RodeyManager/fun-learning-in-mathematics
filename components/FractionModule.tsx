import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Scale, PlusCircle, BookOpen, ArrowDown } from 'lucide-react';

type Mode = 'learn' | 'compare' | 'add';

const Pizza: React.FC<{ 
  numerator: number; 
  denominator: number; 
  size?: number;
  color?: string;
  onClick?: (partIndex: number) => void;
  interactive?: boolean;
}> = ({ numerator, denominator, size = 240, color = '#14b8a6', onClick, interactive = true }) => {
  const radius = size / 2;
  const center = size / 2;
  
  const slices = [];
  for (let i = 0; i < denominator; i++) {
    const startAngle = (i * 360) / denominator;
    const endAngle = ((i + 1) * 360) / denominator;
    
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    const d = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');

    slices.push({ d, active: i < numerator });
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1" />
        {slices.map((slice, index) => (
          <motion.path
            key={`${denominator}-${index}`}
            d={slice.d}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            fill={slice.active ? color : 'transparent'}
            stroke="white"
            strokeWidth="2"
            className={interactive ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}
            onClick={() => interactive && onClick && onClick(index)}
          />
        ))}
      </svg>
    </div>
  );
};

const FractionControl: React.FC<{
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  color?: string;
}> = ({ label, value, onChange, min = 1, max = 12, color = "bg-teal-100 text-teal-700" }) => (
  <div className="flex flex-col items-center">
    <span className="text-xs font-bold text-slate-400 mb-1">{label}</span>
    <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm border border-slate-100">
      <button 
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
      >-</button>
      <span className={`w-8 text-center font-black text-lg ${color.replace('bg-', 'text-').replace('100', '600')}`}>{value}</span>
      <button 
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600 transition-colors"
      >+</button>
    </div>
  </div>
);

export const FractionModule: React.FC = () => {
  const [mode, setMode] = useState<Mode>('learn');
  const [showDecimal, setShowDecimal] = useState(false);
  
  // Learn Mode State
  const [num, setNum] = useState(1);
  const [den, setDen] = useState(4);

  // Compare Mode State
  const [cNum1, setCNum1] = useState(1);
  const [cDen1, setCDen1] = useState(4);
  const [cNum2, setCNum2] = useState(2);
  const [cDen2, setCDen2] = useState(4);

  // Add Mode State
  const [aNum1, setANum1] = useState(1);
  const [aNum2, setANum2] = useState(1);
  const [aDen, setADen] = useState(4);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-teal-100">
        
        {/* Header with Modes */}
        <div className="bg-teal-500 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center text-white gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <PieChart className="w-8 h-8" /> 披萨分数
          </h2>
          <div className="flex bg-teal-700/30 p-1 rounded-xl">
             <button onClick={() => setMode('learn')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${mode === 'learn' ? 'bg-white text-teal-600 shadow' : 'text-teal-100 hover:bg-white/10'}`}>
               <BookOpen size={18} /> 认识
             </button>
             <button onClick={() => setMode('compare')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${mode === 'compare' ? 'bg-white text-teal-600 shadow' : 'text-teal-100 hover:bg-white/10'}`}>
               <Scale size={18} /> 比大小
             </button>
             <button onClick={() => setMode('add')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${mode === 'add' ? 'bg-white text-teal-600 shadow' : 'text-teal-100 hover:bg-white/10'}`}>
               <PlusCircle size={18} /> 加法
             </button>
          </div>
        </div>

        <div className="p-6 md:p-8 min-h-[500px] flex flex-col justify-center">
          
          {/* LEARN MODE */}
          {mode === 'learn' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-center">
                <Pizza 
                  numerator={num} denominator={den} 
                  onClick={(i) => {
                     if (i < num) setNum(Math.max(0, num - 1));
                     else setNum(Math.min(den, num + 1));
                  }}
                />
                <p className="mt-6 text-slate-500 font-medium bg-slate-100 px-4 py-2 rounded-full">点击披萨吃掉它！</p>
              </div>
              
              <div className="bg-teal-50 p-8 rounded-3xl border border-teal-100 flex flex-col items-center gap-8">
                 <div className="flex flex-col items-center">
                    <div className="text-7xl font-black text-teal-600 border-b-4 border-slate-300 pb-2 mb-2 w-24 text-center">{num}</div>
                    <div className="text-7xl font-black text-slate-600 w-24 text-center">{den}</div>
                 </div>
                 
                 <div className="w-full flex justify-between gap-4">
                    <FractionControl label="分子 (几份)" value={num} onChange={(v) => setNum(Math.min(den, v))} min={0} />
                    <FractionControl label="分母 (共几份)" value={den} onChange={(v) => {
                        const newDen = Math.max(1, v);
                        setDen(newDen);
                        if (num > newDen) setNum(newDen);
                    }} />
                 </div>

                 {/* Decimal Conversion */}
                 <div className="w-full pt-6 border-t-2 border-teal-100/50 flex flex-col items-center w-full">
                    <button
                      onClick={() => setShowDecimal(!showDecimal)}
                      className={`text-sm font-bold px-5 py-2 rounded-full transition-all flex items-center gap-2 mb-4
                        ${showDecimal ? 'bg-teal-600 text-white shadow-lg' : 'bg-white text-teal-600 shadow border border-teal-100 hover:bg-teal-50'}
                      `}
                    >
                       {showDecimal ? '隐藏小数' : '变身小数！'} <ArrowDown size={16} className={showDecimal ? 'rotate-180 transition-transform' : 'transition-transform'}/>
                    </button>

                    <AnimatePresence>
                      {showDecimal && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: 'auto', scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          className="w-full bg-white rounded-2xl p-5 shadow-inner border border-slate-100 overflow-hidden"
                        >
                           <div className="flex items-center justify-center gap-3 text-xl font-bold text-slate-600 mb-4 font-mono">
                              <span>{num}</span>
                              <span className="text-sm text-slate-400">÷</span>
                              <span>{den}</span>
                              <span>=</span>
                              <span className="text-3xl text-teal-500">{(num/den).toFixed(2)}</span>
                           </div>

                           {/* Bar Visualization */}
                           <div className="relative h-10 bg-slate-100 rounded-lg w-full overflow-hidden shadow-inner">
                              {/* Background Grid Lines */}
                              <div className="absolute inset-0 flex">
                                {Array.from({length: 9}).map((_, i) => (
                                  <div key={i} className="flex-1 border-r border-slate-200/50"></div>
                                ))}
                              </div>
                              
                              {/* Fill */}
                              <motion.div
                                 initial={{ width: 0 }}
                                 animate={{ width: `${(num/den) * 100}%` }}
                                 transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-300 to-teal-400"
                              />
                              
                              {/* Labels */}
                              <div className="absolute inset-0 flex justify-between px-2 text-[10px] text-slate-400 font-bold items-center z-10 mix-blend-multiply">
                                 <span>0</span>
                                 <span>0.5</span>
                                 <span>1.0</span>
                              </div>
                           </div>
                           
                           <p className="text-xs text-center text-slate-400 mt-3 font-medium">
                             分数线就像除号，<span className="text-teal-500 font-bold">分子 ÷ 分母</span> 就是小数哦！
                           </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              </div>
            </div>
          )}

          {/* COMPARE MODE */}
          {mode === 'compare' && (() => {
             const val1 = cNum1 / cDen1;
             const val2 = cNum2 / cDen2;
             const isEqual = Math.abs(val1 - val2) < 0.0001;
             const isLeftLarger = val1 > val2;
             const isRightLarger = val2 > val1;

             return (
            <div className="flex flex-col items-center gap-8 mt-4">
               <div className="flex flex-col md:flex-row items-center justify-center w-full gap-4 md:gap-12">
                  
                  {/* Left Fraction */}
                  <motion.div 
                    animate={{ 
                      scale: isLeftLarger ? 1.1 : (isEqual ? 1 : 0.95),
                      opacity: (isLeftLarger || isEqual) ? 1 : 0.8,
                    }}
                    className={`flex flex-col items-center gap-6 p-6 rounded-3xl border-4 transition-colors relative ${
                      isLeftLarger 
                        ? 'bg-orange-50 border-orange-400 shadow-2xl z-10' 
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    {isLeftLarger && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute -top-5 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                      >
                         <span className="text-lg">👑</span> 更大
                      </motion.div>
                    )}
                    
                    <Pizza numerator={cNum1} denominator={cDen1} size={180} color="#f97316" 
                           onClick={() => setCNum1(n => n < cDen1 ? n + 1 : 0)} 
                    />
                    <div className="flex gap-4">
                      <FractionControl label="分子" value={cNum1} onChange={(v) => setCNum1(Math.min(cDen1, v))} min={0} color="bg-orange-100" />
                      <FractionControl label="分母" value={cDen1} onChange={(v) => {setCDen1(v); if(cNum1 > v) setCNum1(v)}} color="bg-orange-100" />
                    </div>
                  </motion.div>

                  {/* Operator */}
                  <motion.div 
                    key={`${isLeftLarger}-${isRightLarger}`}
                    initial={{ scale: 0.5, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className={`text-6xl font-black w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-4 z-20 shrink-0 ${
                       isEqual ? 'bg-slate-100 text-slate-400 border-slate-200' :
                       isLeftLarger ? 'bg-orange-500 text-white border-orange-200' :
                       'bg-blue-500 text-white border-blue-200'
                    }`}
                  >
                     {isEqual ? '=' : isLeftLarger ? '>' : '<'}
                  </motion.div>

                  {/* Right Fraction */}
                  <motion.div 
                    animate={{ 
                      scale: isRightLarger ? 1.1 : (isEqual ? 1 : 0.95),
                      opacity: (isRightLarger || isEqual) ? 1 : 0.8,
                    }}
                    className={`flex flex-col items-center gap-6 p-6 rounded-3xl border-4 transition-colors relative ${
                      isRightLarger 
                        ? 'bg-blue-50 border-blue-400 shadow-2xl z-10' 
                        : 'bg-white border-slate-100'
                    }`}
                  >
                    {isRightLarger && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute -top-5 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1"
                      >
                         <span className="text-lg">👑</span> 更大
                      </motion.div>
                    )}

                    <Pizza numerator={cNum2} denominator={cDen2} size={180} color="#3b82f6" 
                           onClick={() => setCNum2(n => n < cDen2 ? n + 1 : 0)} 
                    />
                    <div className="flex gap-4">
                      <FractionControl label="分子" value={cNum2} onChange={(v) => setCNum2(Math.min(cDen2, v))} min={0} color="bg-blue-100" />
                      <FractionControl label="分母" value={cDen2} onChange={(v) => {setCDen2(v); if(cNum2 > v) setCNum2(v)}} color="bg-blue-100" />
                    </div>
                  </motion.div>
               </div>
               
               <p className="text-slate-400 text-sm font-medium">点击披萨或使用按钮调整大小</p>
            </div>
             );
          })()}

          {/* ADDITION MODE */}
          {mode === 'add' && (
             <div className="flex flex-col items-center">
                <div className="bg-yellow-50 p-8 rounded-3xl border border-yellow-100 w-full max-w-2xl">
                   <div className="flex items-center justify-center gap-4 mb-8">
                      {/* Visual Pizza showing both parts */}
                      <div className="relative w-[240px] h-[240px]">
                        <svg width="240" height="240" viewBox="0 0 240 240">
                          <circle cx="120" cy="120" r="120" fill="#f8fafc" stroke="#e2e8f0" />
                          {/* Part 1 Slices */}
                          {Array.from({length: aNum1}).map((_, i) => {
                             const startAngle = (i * 360) / aDen;
                             const endAngle = ((i + 1) * 360) / aDen;
                             // Calculate path (simplified for brevity, assumes standard Pizza logic)
                             const r = 120, cx = 120, cy = 120;
                             const toRad = (deg: number) => (deg - 90) * Math.PI / 180;
                             const x1 = cx + r * Math.cos(toRad(startAngle));
                             const y1 = cy + r * Math.sin(toRad(startAngle));
                             const x2 = cx + r * Math.cos(toRad(endAngle));
                             const y2 = cy + r * Math.sin(toRad(endAngle));
                             const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
                             return <path key={`p1-${i}`} d={d} fill="#facc15" stroke="white" strokeWidth="2" />
                          })}
                          {/* Part 2 Slices (offset by Part 1) */}
                          {Array.from({length: aNum2}).map((_, i) => {
                             if (aNum1 + i >= aDen) return null; // Prevent overflow visually
                             const startAngle = ((i + aNum1) * 360) / aDen;
                             const endAngle = ((i + aNum1 + 1) * 360) / aDen;
                             const r = 120, cx = 120, cy = 120;
                             const toRad = (deg: number) => (deg - 90) * Math.PI / 180;
                             const x1 = cx + r * Math.cos(toRad(startAngle));
                             const y1 = cy + r * Math.sin(toRad(startAngle));
                             const x2 = cx + r * Math.cos(toRad(endAngle));
                             const y2 = cy + r * Math.sin(toRad(endAngle));
                             const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
                             return <path key={`p2-${i}`} d={d} fill="#a855f7" stroke="white" strokeWidth="2" />
                          })}
                        </svg>
                      </div>
                   </div>

                   {/* Equation Controls */}
                   <div className="flex items-center justify-center gap-3 md:gap-6 text-3xl font-bold text-slate-700">
                      
                      <div className="flex flex-col items-center">
                         <div className="text-yellow-500 border-b-2 border-slate-300 w-12 text-center">{aNum1}</div>
                         <div className="text-sm text-slate-400 mt-1">{aDen}</div>
                         <div className="mt-2 flex gap-1">
                            <button onClick={()=>setANum1(Math.max(0, aNum1-1))} className="w-6 h-6 rounded bg-slate-200 text-xs">-</button>
                            <button onClick={()=>setANum1(Math.min(aDen - aNum2, aNum1+1))} className="w-6 h-6 rounded bg-slate-200 text-xs">+</button>
                         </div>
                      </div>

                      <div className="text-slate-400">+</div>

                      <div className="flex flex-col items-center">
                         <div className="text-purple-500 border-b-2 border-slate-300 w-12 text-center">{aNum2}</div>
                         <div className="text-sm text-slate-400 mt-1">{aDen}</div>
                         <div className="mt-2 flex gap-1">
                            <button onClick={()=>setANum2(Math.max(0, aNum2-1))} className="w-6 h-6 rounded bg-slate-200 text-xs">-</button>
                            <button onClick={()=>setANum2(Math.min(aDen - aNum1, aNum2+1))} className="w-6 h-6 rounded bg-slate-200 text-xs">+</button>
                         </div>
                      </div>

                      <div className="text-slate-400">=</div>

                      <div className="flex flex-col items-center">
                         <div className="text-slate-800 border-b-2 border-slate-300 w-12 text-center">{aNum1 + aNum2}</div>
                         <div className="text-sm text-slate-400 mt-1">{aDen}</div>
                      </div>

                   </div>
                   
                   <div className="mt-8 text-center">
                      <p className="text-slate-500 font-medium">分母（一共几块）不变，只加分子（吃了多少块）。</p>
                      <div className="mt-4 flex justify-center items-center gap-2">
                         <span className="text-sm text-slate-400 font-bold">调整分母:</span>
                         <FractionControl label="" value={aDen} onChange={(v) => {setADen(v); if(aNum1+aNum2 > v) { setANum1(0); setANum2(0); }}} min={2} max={12} />
                      </div>
                   </div>

                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};