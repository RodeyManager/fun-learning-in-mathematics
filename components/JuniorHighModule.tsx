
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, TrendingUp, CircleDashed, Variable, Divide, BookOpen, GitMerge, ArrowLeftRight, CheckCircle2, GitCommit, Spline } from 'lucide-react';

type Mode = 'algebra' | 'functions' | 'trig' | 'systems' | 'inequality' | 'quadratics' | 'angles';

export const JuniorHighModule: React.FC = () => {
  const [mode, setMode] = useState<Mode>('functions');

  // Function State (y = kx + b)
  const [k, setK] = useState(1);
  const [b, setB] = useState(0);

  // Trig State
  const [angle, setAngle] = useState(45);

  // Algebra State (ax + b = c)
  const [eqStep, setEqStep] = useState(0);

  // Systems State (Two lines)
  const [sysK1, setSysK1] = useState(2);
  const [sysB1, setSysB1] = useState(1);
  const [sysK2, setSysK2] = useState(-1);
  const [sysB2, setSysB2] = useState(4);

  // Inequality State
  const [ineqVal, setIneqVal] = useState(2);
  const [ineqType, setIneqType] = useState<'>' | '<' | '>=' | '<='>('>');

  // Quadratic State (y = ax^2 + bx + c)
  const [qa, setQa] = useState(1);
  const [qb, setQb] = useState(0);
  const [qc, setQc] = useState(-4);

  // Angles State
  const [geoAngle, setGeoAngle] = useState(60);

  const renderFunctionGraph = (kVal: number, bVal: number, color: string = "#6366f1", isSystem: boolean = false) => {
    const w = isSystem ? 300 : 300;
    const h = 300;
    const scale = 20; // pixels per unit
    const centerX = w / 2;
    const centerY = h / 2;

    const x1_real = -10;
    const y1_real = kVal * x1_real + bVal;
    const x1_px = centerX + x1_real * scale;
    const y1_px = centerY - y1_real * scale;

    const x2_real = 10;
    const y2_real = kVal * x2_real + bVal;
    const x2_px = centerX + x2_real * scale;
    const y2_px = centerY - y2_real * scale;

    return (
      <line x1={x1_px} y1={y1_px} x2={x2_px} y2={y2_px} stroke={color} strokeWidth="3" />
    );
  };

  const renderGrid = (w: number, h: number, scale: number = 20) => (
    <>
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`, 
             backgroundSize: `${scale}px ${scale}px`,
             backgroundPosition: 'center'
           }}>
      </div>
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-800"></div>
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800"></div>
      <div className="absolute top-2 right-2 font-mono text-xs text-slate-400">x</div>
      <div className="absolute top-2 left-1/2 ml-2 font-mono text-xs text-slate-400">y</div>
    </>
  );

  const renderTrigCircle = () => {
    const size = 260;
    const r = 100;
    const center = size / 2;
    
    const rad = (angle * Math.PI) / 180;
    const x = center + r * Math.cos(rad);
    const y = center - r * Math.sin(rad);

    return (
      <div className="relative">
         <svg width={size} height={size} className="overflow-visible bg-white rounded-full shadow-inner border border-slate-200">
           <line x1={center} y1="0" x2={center} y2={size} stroke="#e2e8f0" />
           <line x1="0" y1={center} x2={size} y2={center} stroke="#e2e8f0" />
           <circle cx={center} cy={center} r={r} fill="none" stroke="#94a3b8" strokeDasharray="4" />
           <path d={`M ${center + 20} ${center} A 20 20 0 0 0 ${center + 20 * Math.cos(rad)} ${center - 20 * Math.sin(rad)}`} fill="rgba(99, 102, 241, 0.2)" />
           <line x1={center} y1={center} x2={x} y2={y} stroke="#1e293b" strokeWidth="2" />
           <line x1={center} y1={center} x2={x} y2={center} stroke="#3b82f6" strokeWidth="3" />
           <line x1={x} y1={center} x2={x} y2={y} stroke="#ef4444" strokeWidth="3" />
           <circle cx={x} cy={y} r="6" fill="#6366f1" />
         </svg>
         <div className="absolute top-1/2 left-1/2 -translate-y-1/2 translate-x-4 text-xs font-bold text-slate-400">0°</div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-2 text-xs font-bold text-slate-400">90°</div>
      </div>
    );
  };

  const renderAlgebraBalance = () => {
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
            <motion.div 
              className="absolute bottom-4 left-4 right-4 md:left-20 md:right-20 h-3 bg-slate-300 rounded-full origin-center"
              animate={{ rotate: eqStep === 0 ? [0, 1, 0, -1, 0] : 0 }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
               <div className="absolute left-10 top-2 h-20 w-1 bg-slate-300 origin-top animate-swing-slow"></div>
               <div className="absolute right-10 top-2 h-20 w-1 bg-slate-300 origin-top"></div>
            </motion.div>
            <div className="absolute bottom-0 left-1/2 w-4 h-32 bg-slate-400 -translate-x-1/2 rounded-t-lg shadow-inner"></div>
            <div className="absolute bottom-0 left-1/2 w-24 h-4 bg-slate-500 -translate-x-1/2 rounded-t-xl"></div>

            <motion.div 
               layout
               className="flex flex-col items-center gap-3 mb-10 p-4 border-b-8 border-slate-300 w-1/3 bg-slate-100/50 rounded-b-3xl backdrop-blur-sm z-10"
               animate={{ y: [0, 2, 0] }}
               transition={{ repeat: Infinity, duration: 4 }}
            >
               <div className="flex gap-2 flex-wrap justify-center min-h-[50px] items-end">
                 <AnimatePresence>
                   {(eqStep <= 1) && blockX("L_x_1")}
                   {(eqStep <= 2) && blockX("L_x_2")}
                 </AnimatePresence>
               </div>
               <div className="flex gap-1 flex-wrap justify-center">
                 <AnimatePresence>
                   {eqStep === 0 && Array.from({length: 6}).map((_, i) => unit(`L_unit_${i}`))}
                 </AnimatePresence>
               </div>
            </motion.div>

            <motion.div 
               layout
               className="flex flex-col items-center gap-3 mb-10 p-4 border-b-8 border-slate-300 w-1/3 bg-slate-100/50 rounded-b-3xl backdrop-blur-sm z-10"
               animate={{ y: [0, -2, 0] }}
               transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
            >
               <div className="flex gap-1 flex-wrap justify-center max-w-[160px] min-h-[50px] items-end">
                 <AnimatePresence>
                   {Array.from({length: 3}).map((_, i) => unit(`R_unit_stable_${i}`))}
                   {eqStep <= 1 && Array.from({length: 3}).map((_, i) => unit(`R_unit_s2_${i}`))}
                   {eqStep === 0 && Array.from({length: 6}).map((_, i) => unit(`R_unit_s1_${i}`))}
                 </AnimatePresence>
               </div>
            </motion.div>
         </div>

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

  const renderSystemsGraph = () => {
    // Solve intersection: k1*x + b1 = k2*x + b2 => x(k1 - k2) = b2 - b1
    let xInt: number | null = null;
    let yInt: number | null = null;
    let status = 'one'; // 'one', 'none', 'infinite'

    if (sysK1 === sysK2) {
      status = sysB1 === sysB2 ? 'infinite' : 'none';
    } else {
      xInt = (sysB2 - sysB1) / (sysK1 - sysK2);
      yInt = sysK1 * xInt + sysB1;
    }

    // Coordinates for display
    const scale = 20;
    const w = 300, h = 300;
    const cx = w/2, cy = h/2;

    return (
        <div className="flex flex-col items-center">
            <div className="relative bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden" style={{width: w, height: h}}>
                {renderGrid(w, h, scale)}
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                    {renderFunctionGraph(sysK1, sysB1, "#ef4444", true)} {/* Red Line */}
                    {renderFunctionGraph(sysK2, sysB2, "#3b82f6", true)} {/* Blue Line */}
                    
                    {/* Intersection Point */}
                    {status === 'one' && xInt !== null && yInt !== null && (
                        <g>
                            <circle cx={cx + xInt * scale} cy={cy - yInt * scale} r="6" fill="#10b981" stroke="white" strokeWidth="2" className="drop-shadow-md" />
                            <foreignObject x={cx + xInt * scale + 10} y={cy - yInt * scale - 30} width="80" height="40">
                                <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow opacity-90">
                                    ({xInt.toFixed(1)}, {yInt.toFixed(1)})
                                </div>
                            </foreignObject>
                        </g>
                    )}
                </svg>
                <div className="absolute bottom-2 left-2 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold bg-white/80 p-1 rounded border border-red-100">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div> L1: y = {sysK1}x + {sysB1}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold bg-white/80 p-1 rounded border border-blue-100">
                        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> L2: y = {sysK2}x + {sysB2}
                    </div>
                </div>
            </div>
            
            <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200 w-full max-w-[300px] text-center">
                {status === 'one' && (
                    <div className="text-emerald-600 font-bold flex items-center justify-center gap-2">
                        <CheckCircle2 size={18}/> 唯一解 (Intersection)
                    </div>
                )}
                {status === 'none' && (
                    <div className="text-slate-500 font-bold flex items-center justify-center gap-2">
                        <Divide size={18} className="rotate-90"/> 无解 (Parallel)
                    </div>
                )}
                {status === 'infinite' && (
                    <div className="text-indigo-600 font-bold flex items-center justify-center gap-2">
                        <GitMerge size={18}/> 无数解 (Coincident)
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderInequalityLine = () => {
     // Number Line Visualization
     const range = 10; // -5 to 5
     const w = 400;
     const scale = w / range; // pixels per unit
     const cx = w / 2;

     const xPos = cx + ineqVal * scale;
     
     // Determine fill color and direction
     const isRight = ineqType === '>' || ineqType === '>=';
     const isFilled = ineqType === '>=' || ineqType === '<=';
     const color = "#f59e0b"; // Amber

     return (
         <div className="flex flex-col items-center w-full">
             <div className="relative w-full max-w-[400px] h-24 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                 {/* Main Line */}
                 <div className="absolute w-full h-0.5 bg-slate-300"></div>
                 
                 {/* Ticks */}
                 {Array.from({length: 11}).map((_, i) => {
                     const val = i - 5;
                     const left = cx + val * scale;
                     return (
                         <div key={i} className="absolute h-2 w-0.5 bg-slate-300 top-1/2 -translate-y-1/2 flex flex-col items-center" style={{left}}>
                            <span className="mt-4 text-[10px] text-slate-400 font-mono">{val}</span>
                         </div>
                     )
                 })}

                 {/* Inequality Region */}
                 <div className="absolute h-1 top-1/2 -translate-y-1/2 opacity-30"
                      style={{
                          left: isRight ? xPos : 0,
                          right: isRight ? 0 : w - xPos,
                          backgroundColor: color
                      }}
                 ></div>

                 {/* Arrow */}
                 <div className="absolute top-1/2 -translate-y-1/2 text-amber-500" style={{ [isRight ? 'right' : 'left']: 4 }}>
                     {isRight ? <ArrowLeftRight className="rotate-0" size={16}/> : <ArrowLeftRight className="rotate-180" size={16}/>}
                 </div>

                 {/* Point */}
                 <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-amber-500 rounded-full z-10"
                      style={{
                          left: xPos - 8,
                          backgroundColor: isFilled ? color : 'white'
                      }}
                 ></div>
             </div>

             <div className="font-mono text-3xl font-black text-slate-700 mt-6 bg-slate-100 px-6 py-2 rounded-xl">
                 x <span className="text-amber-500">{ineqType}</span> {ineqVal}
             </div>
             <p className="text-slate-400 text-sm mt-2">
                 {isFilled ? '实心点：包含该数值' : '空心点：不包含该数值'}
             </p>
         </div>
     )
  }

  const renderQuadraticGraph = () => {
     // y = ax^2 + bx + c
     const w = 300, h = 300;
     const scale = 20; 
     const cx = w/2, cy = h/2;

     const f = (x: number) => qa * x * x + qb * x + qc;

     // Calculate points for path
     let pathD = ``;
     let start = true;
     for (let px = 0; px <= w; px+=5) {
        const xReal = (px - cx) / scale;
        const yReal = f(xReal);
        const py = cy - yReal * scale;
        // avoid crazy values
        if (py > -500 && py < 800) {
            if (start) {
                pathD += `M ${px} ${py} `;
                start = false;
            } else {
                pathD += `L ${px} ${py} `;
            }
        }
     }

     // Roots
     const delta = qb*qb - 4*qa*qc;
     const roots = [];
     if (delta >= 0 && qa !== 0) {
        roots.push((-qb + Math.sqrt(delta))/(2*qa));
        roots.push((-qb - Math.sqrt(delta))/(2*qa));
     }

     // Vertex
     const vx = -qb / (2*qa);
     const vy = f(vx);

     return (
        <div className="flex flex-col items-center">
            <div className="relative bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden" style={{width: w, height: h}}>
                {renderGrid(w, h, scale)}
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                    <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="3" />
                    
                    {/* Roots */}
                    {roots.map((r, i) => (
                        <circle key={i} cx={cx + r * scale} cy={cy} r="4" fill="#ef4444" stroke="white" />
                    ))}
                    {/* Vertex */}
                    {qa !== 0 && (
                        <circle cx={cx + vx * scale} cy={cy - vy * scale} r="4" fill="#f59e0b" stroke="white" />
                    )}
                </svg>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 w-full max-w-[400px]">
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-center">
                    <div className="text-xs font-bold text-purple-400 uppercase mb-1">判别式 Δ = b²-4ac</div>
                    <div className={`font-mono font-bold text-lg ${delta > 0 ? 'text-green-600' : delta === 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {delta.toFixed(0)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                        {delta > 0 ? '有两个实根' : delta === 0 ? '有一个实根' : '无实根'}
                    </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-center">
                    <div className="text-xs font-bold text-orange-400 uppercase mb-1">顶点 (Vertex)</div>
                    <div className="font-mono font-bold text-lg text-slate-700">
                        ({vx.toFixed(1)}, {vy.toFixed(1)})
                    </div>
                </div>
            </div>
        </div>
     )
  }

  const renderAngleDemo = () => {
    // Two parallel lines intersected by a transversal line
    // Angle state determines transversal slope
    const w = 320, h = 240;
    const cy = h/2;
    const lineY1 = cy - 40;
    const lineY2 = cy + 40;
    
    // Transversal logic
    // Center at (w/2, cy)
    // x = (y - cy) / tan(theta) + cx ?? simpler:
    // angle in degrees. 0 is horizontal.
    // If angle is 90, vertical line.
    
    const rad = (geoAngle * Math.PI) / 180;
    const length = 180;
    const dx = length * Math.cos(rad);
    const dy = length * Math.sin(rad); // This is deviation from center? No, standard polar
    // Actually we want the line to pass through (cx, cy)
    
    const cx = w/2;
    
    // Calculate endpoints of transversal for visualization
    // It's easier to just rotate a line div or svg line
    const x1 = cx - 100 * Math.cos(rad);
    const y1 = cy + 100 * Math.sin(rad);
    const x2 = cx + 100 * Math.cos(rad);
    const y2 = cy - 100 * Math.sin(rad);

    // Angles display logic
    // We have 8 angles. 4 at top intersection, 4 at bottom.
    // Top Intersection: (cx + offset, lineY1)
    // Bottom Intersection: (cx - offset, lineY2) ... need to calculate precise intersection x
    // Line eq: (y - cy) = tan(-rad) * (x - cx)  (Screen coords Y is inverted for math, let's keep it visual)
    
    // Visual Hack: Just rotate the whole group of angles? No, text needs to stay upright.
    
    const smallAngle = Math.min(geoAngle, 180 - geoAngle);
    const largeAngle = 180 - smallAngle;

    return (
        <div className="flex flex-col items-center">
            <div className="relative bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden" style={{width: w, height: h}}>
                {/* Parallel Lines */}
                <line x1="0" y1={lineY1} x2={w} y2={lineY1} stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="0" y1={lineY2} x2={w} y2={lineY2} stroke="#334155" strokeWidth="2" strokeDasharray="5,5" />
                
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                    <line x1="0" y1={lineY1} x2={w} y2={lineY1} stroke="#cbd5e1" strokeWidth="2" />
                    <line x1="0" y1={lineY2} x2={w} y2={lineY2} stroke="#cbd5e1" strokeWidth="2" />
                    
                    {/* Transversal */}
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ef4444" strokeWidth="3" />
                    
                    {/* Angle Arcs - Simplified visual representation */}
                    {/* We can just put colored dots or labels to show relationships */}
                </svg>

                {/* Labels using absolute positioning relative to approximate intersection points */}
                {/* Top Intersection */}
                <div className="absolute font-bold text-xs" style={{top: lineY1 - 25, left: cx + (y1 < cy ? 20 : -20)}}>
                    <span className="text-blue-500">∠1</span>
                </div>
                 <div className="absolute font-bold text-xs" style={{top: lineY1 - 25, left: cx + (y1 < cy ? -20 : 20)}}>
                    <span className="text-green-500">∠2</span>
                </div>
                
                {/* Bottom Intersection */}
                <div className="absolute font-bold text-xs" style={{top: lineY2 + 10, left: cx + (y2 > cy ? 20 : -20)}}>
                     <span className="text-blue-500">∠3</span>
                </div>
                 <div className="absolute font-bold text-xs" style={{top: lineY2 + 10, left: cx + (y2 > cy ? -20 : 20)}}>
                     <span className="text-green-500">∠4</span>
                </div>
            </div>
            
            <div className="mt-4 flex gap-4 text-sm w-full max-w-[320px]">
                <div className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
                    <div className="font-bold text-blue-600 mb-1">同位角/对顶角</div>
                    <div className="text-2xl font-black text-slate-700">{smallAngle}°</div>
                </div>
                <div className="flex-1 bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                    <div className="font-bold text-green-600 mb-1">邻补角</div>
                    <div className="text-2xl font-black text-slate-700">{largeAngle}°</div>
                </div>
            </div>
            
            <div className="mt-2 text-xs text-slate-400">
                <span className="text-blue-500 font-bold">∠1 = ∠3</span> (同位角相等)
            </div>
        </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-blue-100 min-h-[500px]">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex flex-col xl:flex-row justify-between items-center text-white gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Variable className="w-8 h-8" /> 初中数学实验室
          </h2>
          <div className="flex bg-blue-800/30 p-1 rounded-xl overflow-x-auto max-w-full no-scrollbar">
             <button onClick={() => setMode('algebra')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'algebra' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <Divide size={18} /> 代数
             </button>
             <button onClick={() => setMode('functions')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'functions' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <TrendingUp size={18} /> 函数
             </button>
             <button onClick={() => setMode('systems')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'systems' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <GitMerge size={18} /> 方程组
             </button>
             <button onClick={() => setMode('quadratics')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'quadratics' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <Spline size={18} /> 二次函数
             </button>
             <button onClick={() => setMode('inequality')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'inequality' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <ArrowLeftRight size={18} /> 不等式
             </button>
             <button onClick={() => setMode('trig')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'trig' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <CircleDashed size={18} /> 三角
             </button>
             <button onClick={() => setMode('angles')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'angles' ? 'bg-white text-blue-600 shadow' : 'text-blue-100 hover:bg-white/10'}`}>
               <GitCommit size={18} /> 平行线
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
                        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 hover:shadow-md transition-all hover:bg-blue-50">
                            <div className="text-xl font-serif font-black text-slate-800 mb-3 tracking-wide">
                                (a + b)² <br/> = a² + 2ab + b²
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed">
                                <span className="font-bold text-blue-600 block mb-1 text-sm">完全平方公式 (和)</span>
                                两数和的平方，等于它们的平方和，加上它们积的2倍。
                            </div>
                        </div>
                        <div className="bg-pink-50/50 p-5 rounded-2xl border border-pink-100 hover:shadow-md transition-all hover:bg-pink-50">
                            <div className="text-xl font-serif font-black text-slate-800 mb-3 tracking-wide">
                                (a - b)² <br/> = a² - 2ab + b²
                            </div>
                            <div className="text-xs text-slate-500 leading-relaxed">
                                <span className="font-bold text-pink-600 block mb-1 text-sm">完全平方公式 (差)</span>
                                两数差的平方，等于它们的平方和，减去它们积的2倍。
                            </div>
                        </div>
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
                   <div className="relative bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden" style={{width: 300, height: 300}}>
                        {renderGrid(300, 300)}
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            {renderFunctionGraph(k, b)}
                        </svg>
                   </div>
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

           {/* SYSTEMS MODE */}
           {mode === 'systems' && (
             <div className="flex flex-col md:flex-row items-center gap-12 animate-in fade-in zoom-in duration-300 w-full justify-center">
                {renderSystemsGraph()}
                
                <div className="w-full max-w-xs space-y-4">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="font-bold text-red-800 mb-2 flex items-center gap-2"><div className="w-3 h-3 bg-red-500"></div> 直线 1 (L1)</div>
                        <div className="space-y-3">
                            <div>
                                <label className="flex justify-between text-xs text-slate-500 font-bold mb-1">斜率 k1: {sysK1}</label>
                                <input type="range" min="-5" max="5" step="0.5" value={sysK1} onChange={(e) => setSysK1(parseFloat(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-200 rounded"/>
                            </div>
                            <div>
                                <label className="flex justify-between text-xs text-slate-500 font-bold mb-1">截距 b1: {sysB1}</label>
                                <input type="range" min="-5" max="5" step="1" value={sysB1} onChange={(e) => setSysB1(parseFloat(e.target.value))} className="w-full accent-red-500 h-1 bg-slate-200 rounded"/>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="font-bold text-blue-800 mb-2 flex items-center gap-2"><div className="w-3 h-3 bg-blue-500"></div> 直线 2 (L2)</div>
                        <div className="space-y-3">
                            <div>
                                <label className="flex justify-between text-xs text-slate-500 font-bold mb-1">斜率 k2: {sysK2}</label>
                                <input type="range" min="-5" max="5" step="0.5" value={sysK2} onChange={(e) => setSysK2(parseFloat(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-200 rounded"/>
                            </div>
                            <div>
                                <label className="flex justify-between text-xs text-slate-500 font-bold mb-1">截距 b2: {sysB2}</label>
                                <input type="range" min="-5" max="5" step="1" value={sysB2} onChange={(e) => setSysB2(parseFloat(e.target.value))} className="w-full accent-blue-500 h-1 bg-slate-200 rounded"/>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center">
                        方程组的解 = 两条直线的交点
                    </p>
                </div>
             </div>
           )}

           {/* QUADRATICS MODE (NEW) */}
           {mode === 'quadratics' && (
              <div className="flex flex-col md:flex-row items-center gap-12 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col items-center">
                      <div className="mb-4 text-center">
                          <h3 className="text-xl font-bold text-slate-700">二次函数与抛物线</h3>
                          <p className="text-slate-500 text-sm">y = ax² + bx + c</p>
                      </div>
                      {renderQuadraticGraph()}
                  </div>
                  
                  <div className="w-full md:w-64 space-y-4">
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                          <label className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                              系数 a (开口方向): {qa}
                          </label>
                          <input type="range" min="-3" max="3" step="0.1" value={qa} onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setQa(val === 0 ? 0.1 : val); // prevent 0
                          }} className="w-full accent-purple-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                          <label className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                              系数 b (位置): {qb}
                          </label>
                          <input type="range" min="-5" max="5" step="0.5" value={qb} onChange={(e) => setQb(parseFloat(e.target.value))} className="w-full accent-purple-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                          <label className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                              常数 c (截距): {qc}
                          </label>
                          <input type="range" min="-5" max="5" step="0.5" value={qc} onChange={(e) => setQc(parseFloat(e.target.value))} className="w-full accent-purple-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                      </div>
                  </div>
              </div>
           )}

           {/* ANGLES MODE (NEW) */}
           {mode === 'angles' && (
               <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 w-full max-w-2xl">
                   <div className="mb-8 text-center">
                        <h3 className="text-xl font-bold text-slate-700">平行线与相交线</h3>
                        <p className="text-slate-500 text-sm">观察被截线切割的角的关系</p>
                   </div>
                   
                   {renderAngleDemo()}

                   <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200 w-full max-w-[400px]">
                       <label className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                           截线角度: {geoAngle}°
                       </label>
                       <input 
                        type="range" min="30" max="150" step="1" 
                        value={geoAngle} onChange={(e) => setGeoAngle(parseInt(e.target.value))}
                        className="w-full accent-red-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                       />
                       <div className="flex justify-between text-xs text-slate-400 mt-2">
                           <span>30°</span>
                           <span>90°</span>
                           <span>150°</span>
                       </div>
                   </div>
               </div>
           )}

           {/* INEQUALITY MODE */}
           {mode === 'inequality' && (
               <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300 w-full max-w-2xl">
                   <div className="mb-8 text-center">
                        <h3 className="text-xl font-bold text-slate-700">一元一次不等式</h3>
                        <p className="text-slate-500 text-sm">在数轴上表示 x 的取值范围</p>
                   </div>
                   
                   {renderInequalityLine()}

                   <div className="flex gap-4 mt-8 w-full justify-center">
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex gap-2">
                           {(['>', '<', '>=', '<='] as const).map(op => (
                               <button 
                                key={op}
                                onClick={() => setIneqType(op)}
                                className={`w-12 h-12 rounded-xl font-black text-lg flex items-center justify-center transition-all ${ineqType === op ? 'bg-amber-500 text-white shadow-lg scale-110' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-100'}`}
                               >
                                   {op.replace('>=', '≥').replace('<=', '≤')}
                               </button>
                           ))}
                       </div>
                       
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-center w-48">
                           <label className="text-xs font-bold text-slate-400 mb-2 flex justify-between">
                               <span>数值</span>
                               <span>{ineqVal}</span>
                           </label>
                           <input 
                            type="range" min="-4" max="4" step="0.5" 
                            value={ineqVal} onChange={(e) => setIneqVal(parseFloat(e.target.value))}
                            className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                           />
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
