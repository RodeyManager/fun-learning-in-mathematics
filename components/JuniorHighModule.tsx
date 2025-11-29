
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, CircleDashed, Variable, Divide, BookOpen } from 'lucide-react';

type Mode = 'algebra' | 'functions' | 'trig';

export const JuniorHighModule: React.FC = () => {
  const [mode, setMode] = useState<Mode>('functions');

  // Function State (y = kx + b)
  const [k, setK] = useState(1);
  const [b, setB] = useState(0);

  // Trig State
  const [angle, setAngle] = useState(45);

  // Algebra State (ax + b = c)
  // We represent this as solving 2x + 6 = 12 visually
  const [eqStep, setEqStep] = useState(0);

  const renderFunctionGraph = () => {
    const w = 300;
    const h = 300;
    const scale = 20; // pixels per unit
    const centerX = w / 2;
    const centerY = h / 2;

    // Calculate start and end points of the line
    // y = kx + b
    // At x = -10 (left edge relative to center) -> real x approx -7.5
    // x_pixel = 0 => x_real = -centerX / scale = -7.5
    
    const x1_real = -10;
    const y1_real = k * x1_real + b;
    const x1_px = centerX + x1_real * scale;
    const y1_px = centerY - y1_real * scale;

    const x2_real = 10;
    const y2_real = k * x2_real + b;
    const x2_px = centerX + x2_real * scale;
    const y2_px = centerY - y2_real * scale;

    return (
      <div className="relative bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden" style={{width: w, height: h}}>
        {/* Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`, 
               backgroundSize: `${scale}px ${scale}px`,
               backgroundPosition: 'center'
             }}>
        </div>
        
        {/* Axes */}
        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-800"></div>
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800"></div>

        {/* The Line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <line x1={x1_px} y1={y1_px} x2={x2_px} y2={y2_px} stroke="#6366f1" strokeWidth="3" />
        </svg>

        {/* Labels */}
        <div className="absolute top-2 right-2 font-mono text-xs text-slate-400">x</div>
        <div className="absolute top-2 left-1/2 ml-2 font-mono text-xs text-slate-400">y</div>
      </div>
    );
  };

  const renderTrigCircle = () => {
    const size = 260;
    const r = 100;
    const center = size / 2;
    
    const rad = (angle * Math.PI) / 180;
    // Note: SVG Y coordinates are inverted (down is positive), so subtract sin for Y
    const x = center + r * Math.cos(rad);
    const y = center - r * Math.sin(rad);

    return (
      <div className="relative">
         <svg width={size} height={size} className="overflow-visible bg-white rounded-full shadow-inner border border-slate-200">
           {/* Axes */}
           <line x1={center} y1="0" x2={center} y2={size} stroke="#e2e8f0" />
           <line x1="0" y1={center} x2={size} y2={center} stroke="#e2e8f0" />
           
           {/* Unit Circle */}
           <circle cx={center} cy={center} r={r} fill="none" stroke="#94a3b8" strokeDasharray="4" />

           {/* Angle Arc */}
           <path d={`M ${center + 20} ${center} A 20 20 0 0 0 ${center + 20 * Math.cos(rad)} ${center - 20 * Math.sin(rad)}`} fill="rgba(99, 102, 241, 0.2)" />

           {/* Radius Line */}
           <line x1={center} y1={center} x2={x} y2={y} stroke="#1e293b" strokeWidth="2" />
           
           {/* Cos Line (Blue, Horizontal) */}
           <line x1={center} y1={center} x2={x} y2={center} stroke="#3b82f6" strokeWidth="3" />
           
           {/* Sin Line (Red, Vertical) */}
           <line x1={x} y1={center} x2={x} y2={y} stroke="#ef4444" strokeWidth="3" />
           
           {/* Point */}
           <circle cx={x} cy={y} r="6" fill="#6366f1" />
         </svg>
         
         {/* Labels */}
         <div className="absolute top-1/2 left-1/2 -translate-y-1/2 translate-x-4 text-xs font-bold text-slate-400">0°</div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 text-xs font-bold text-slate-400">90°</div>
      </div>
    );
  };

  const renderAlgebraBalance = () => {
    // Equation: 2x + 6 = 12
    // Step 0: Display full equation.
    // Step 1 (Subtract 6): Left removes 6 units. Right removes 6 units (leaves 6).
    // Step 2 (Divide by 2): Left removes 1 x. Right removes 3 units (leaves 3).

    const blockX = (key: string) => (
      <motion.div 
        layout
        key={key}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-12 h-12 bg-indigo-500 rounded-lg text-white flex items-center justify-center font-bold text-xl shadow-md border-b-4 border-indigo-700"
      >
        x
      </motion.div>
    );

    const unit = (key: string) => (
      <motion.div 
        layout
        key={key}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="w-8 h-8 bg-yellow-400 rounded-full shadow-sm border-b-2 border-yellow-600 flex items-center justify-center text-[10px] text-yellow-700 font-bold"
      >
        1
      </motion.div>
    );

    return (
      <div className="flex flex-col items-center w-full">
         <div className="h-64 flex items-end justify-center gap-4 md:gap-12 mb-4 w-full relative perspective-[1000px]">
            
            {/* Balance Structure */}
            <motion.div 
              className="absolute bottom-4 left-4 right-4 md:left-20 md:right-20 h-3 bg-slate-300 rounded-full origin-center"
              animate={{ rotate: eqStep === 0 ? [0, 1, 0, -1, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
               {/* Left Pan Hanger */}
               <div className="absolute left-10 top-2 h-20 w-1 bg-slate-300 origin-top animate-swing-slow"></div>
               {/* Right Pan Hanger */}
               <div className="absolute right-10 top-2 h-20 w-1 bg-slate-300 origin-top"></div>
            </motion.div>
            
            {/* Base */}
            <div className="absolute bottom-0 left-1/2 w-4 h-32 bg-slate-400 -translate-x-1/2 rounded-t-lg shadow-inner"></div>
            <div className="absolute bottom-0 left-1/2 w-24 h-4 bg-slate-500 -translate-x-1/2 rounded-t-xl"></div>

            {/* Left Pan Container */}
            <motion.div 
               layout
               className="flex flex-col items-center gap-3 mb-10 p-4 border-b-8 border-slate-300 w-1/3 bg-slate-100/50 rounded-b-3xl backdrop-blur-sm z-10"
               animate={{ y: [0, 2, 0] }}
               transition={{ repeat: Infinity, duration: 4 }}
            >
               <div className="flex gap-2 flex-wrap justify-center min-h-[50px] items-end">
                 {/* Left Xs: Keep 2 for step 0&1, Keep 1 for step 2 */}
                 <AnimatePresence>
                   {(eqStep <= 1) && blockX("L_x_1")}
                   {(eqStep <= 2) && blockX("L_x_2")}
                 </AnimatePresence>
               </div>
               <div className="flex gap-1 flex-wrap justify-center">
                 {/* Left Units: 6 units initially, all remove in step 1 */}
                 <AnimatePresence>
                   {eqStep === 0 && Array.from({length: 6}).map((_, i) => unit(`L_unit_${i}`))}
                 </AnimatePresence>
               </div>
            </motion.div>

            {/* Right Pan Container */}
            <motion.div 
               layout
               className="flex flex-col items-center gap-3 mb-10 p-4 border-b-8 border-slate-300 w-1/3 bg-slate-100/50 rounded-b-3xl backdrop-blur-sm z-10"
               animate={{ y: [0, -2, 0] }}
               transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
            >
               <div className="flex gap-1 flex-wrap justify-center max-w-[160px] min-h-[50px] items-end">
                 {/* Right Units logic: 
                    Step 0: 12 units
                    Step 1: 6 units (Remove 6)
                    Step 2: 3 units (Remove 3)
                 */}
                 <AnimatePresence>
                   {/* Persistent units (0-2) stay until the end */}
                   {Array.from({length: 3}).map((_, i) => unit(`R_unit_stable_${i}`))}
                   
                   {/* Units (3-5) remove at step 2 */}
                   {eqStep <= 1 && Array.from({length: 3}).map((_, i) => unit(`R_unit_s2_${i}`))}
                   
                   {/* Units (6-11) remove at step 1 */}
                   {eqStep === 0 && Array.from({length: 6}).map((_, i) => unit(`R_unit_s1_${i}`))}
                 </AnimatePresence>
               </div>
            </motion.div>

         </div>

         {/* Equation Text Animation */}
         <div className="text-3xl md:text-5xl font-mono font-bold text-slate-700 mb-8 h-16 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode='wait'>
               {eqStep === 0 && (
                 <motion.div 
                    key="step0"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="flex gap-4 items-center"
                 >
                    <span className="text-indigo-600">2x</span> + <span className="text-yellow-600">6</span> = <span className="text-slate-800">12</span>
                 </motion.div>
               )}
               {eqStep === 1 && (
                 <motion.div 
                    key="step1"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="flex gap-4 items-center"
                 >
                    <span className="text-indigo-600">2x</span> = <span className="text-slate-800">6</span>
                    <span className="text-xs font-sans text-slate-400 font-normal ml-2">(两边同时 -6)</span>
                 </motion.div>
               )}
               {eqStep === 2 && (
                 <motion.div 
                    key="step2"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    className="flex gap-4 items-center"
                 >
                    <span className="text-indigo-600">x</span> = <span className="text-slate-800">3</span>
                    <span className="text-xs font-sans text-slate-400 font-normal ml-2">(两边同时 ÷2)</span>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Controls */}
         <div className="flex gap-4">
            <button 
              onClick={() => setEqStep(Math.max(0, eqStep - 1))}
              disabled={eqStep === 0}
              className="px-6 py-3 rounded-xl bg-slate-200 text-slate-500 disabled:opacity-50 font-bold transition-transform hover:scale-105 active:scale-95"
            >
              上一步
            </button>
            <button 
              onClick={() => setEqStep(Math.min(2, eqStep + 1))}
              disabled={eqStep === 2}
              className="px-10 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              {eqStep === 0 ? '移项 (-6)' : eqStep === 1 ? '系数化为1 (÷2)' : '完成'}
              {eqStep < 2 && <TrendingUp size={18} />}
            </button>
         </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-100 min-h-[500px]">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex flex-col md:flex-row justify-between items-center text-white gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Variable className="w-8 h-8" /> 初中数学实验室
          </h2>
          <div className="flex bg-blue-800/30 p-1 rounded-xl">
             <button onClick={() => setMode('algebra')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${mode === 'algebra' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <Divide size={18} /> 代数
             </button>
             <button onClick={() => setMode('functions')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${mode === 'functions' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <TrendingUp size={18} /> 函数
             </button>
             <button onClick={() => setMode('trig')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${mode === 'trig' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <CircleDashed size={18} /> 三角
             </button>
          </div>
        </div>

        <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
           
           {/* ALGEBRA MODE */}
           {mode === 'algebra' && (
             <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold text-slate-700">解一元一次方程</h3>
                  <p className="text-slate-500 text-sm">观察天平如何保持平衡，逐步求解 x</p>
                </div>
                {renderAlgebraBalance()}
                
                {/* NEW SECTION: Common Formulas */}
                <div className="mt-16 w-full max-w-3xl">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2 border-b border-slate-200 pb-2">
                        <BookOpen className="w-5 h-5 text-blue-500"/> 常用代数公式 (乘法公式)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Perfect Square (Sum) */}
                        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 hover:shadow-md transition-all hover:bg-blue-50">
                            <div className="text-xl font-serif font-black text-slate-800 mb-3 tracking-wide">
                                (a + b)² <br/> = a² + 2ab + b²
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed">
                                <span className="font-bold text-blue-600 block mb-1 text-sm">完全平方公式 (和)</span>
                                两数和的平方，等于它们的平方和，加上它们积的2倍。
                            </div>
                        </div>

                        {/* Perfect Square (Diff) */}
                        <div className="bg-pink-50/50 p-5 rounded-2xl border border-pink-100 hover:shadow-md transition-all hover:bg-pink-50">
                            <div className="text-xl font-serif font-black text-slate-800 mb-3 tracking-wide">
                                (a - b)² <br/> = a² - 2ab + b²
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed">
                                <span className="font-bold text-pink-600 block mb-1 text-sm">完全平方公式 (差)</span>
                                两数差的平方，等于它们的平方和，减去它们积的2倍。
                            </div>
                        </div>

                        {/* Difference of Squares */}
                        <div className="bg-teal-50/50 p-5 rounded-2xl border border-teal-100 hover:shadow-md transition-all hover:bg-teal-50">
                            <div className="text-xl font-serif font-black text-slate-800 mb-3 tracking-wide">
                                a² - b² <br/> = (a + b)(a - b)
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed">
                                <span className="font-bold text-teal-600 block mb-1 text-sm">平方差公式</span>
                                两个数的平方差，等于这两个数的和与这两个数的差的积。
                            </div>
                        </div>
                    </div>
                </div>

             </div>
           )}

           {/* FUNCTIONS MODE */}
           {mode === 'functions' && (
             <div className="flex flex-col md:flex-row items-center gap-12 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center">
                   {renderFunctionGraph()}
                   <p className="mt-4 font-mono text-xl font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
                      y = <span className="text-pink-500">{k}</span>x {b >= 0 ? '+' : ''} <span className="text-teal-500">{b}</span>
                   </p>
                </div>

                <div className="w-full md:w-64 space-y-6">
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <label className="block text-sm font-bold text-slate-500 mb-2">斜率 (k) = <span className="text-pink-500">{k}</span></label>
                      <input 
                        type="range" min="-5" max="5" step="0.5" 
                        value={k} onChange={(e) => setK(parseFloat(e.target.value))}
                        className="w-full accent-pink-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-slate-400 mt-2">决定直线的倾斜程度</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <label className="block text-sm font-bold text-slate-500 mb-2">截距 (b) = <span className="text-teal-500">{b}</span></label>
                      <input 
                        type="range" min="-5" max="5" step="1" 
                        value={b} onChange={(e) => setB(parseFloat(e.target.value))}
                        className="w-full accent-teal-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <p className="text-xs text-slate-400 mt-2">决定直线与 y 轴的交点</p>
                   </div>
                </div>
             </div>
           )}

           {/* TRIGONOMETRY MODE */}
           {mode === 'trig' && (
             <div className="flex flex-col md:flex-row items-center gap-12 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center">
                   {renderTrigCircle()}
                </div>

                <div className="w-full md:w-72 space-y-6">
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                      <div className="text-4xl font-black text-slate-700 mb-2">{angle}°</div>
                      <input 
                        type="range" min="0" max="360" step="15" 
                        value={angle} onChange={(e) => setAngle(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-4"
                      />
                      
                      <div className="grid grid-cols-2 gap-4 text-left">
                         <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                            <span className="text-xs font-bold text-red-400 block">正弦 (sin)</span>
                            <span className="text-xl font-bold text-red-600">{Math.sin(angle * Math.PI / 180).toFixed(3)}</span>
                         </div>
                         <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <span className="text-xs font-bold text-blue-400 block">余弦 (cos)</span>
                            <span className="text-xl font-bold text-blue-600">{Math.cos(angle * Math.PI / 180).toFixed(3)}</span>
                         </div>
                      </div>
                      
                      <p className="text-xs text-slate-400 mt-4 text-left leading-relaxed">
                        在单位圆（半径为1）中，<br/>
                        <span className="text-red-500 font-bold">红色高度</span> 是 sin<br/>
                        <span className="text-blue-500 font-bold">蓝色宽度</span> 是 cos
                      </p>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};
