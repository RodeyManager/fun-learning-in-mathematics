
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart2, Dices, MousePointerClick, RefreshCcw, MoveHorizontal, Layers, ArrowRight } from 'lucide-react';

type Mode = 'calculus' | 'stats' | 'prob' | 'comp';

// --- Helper Math Functions ---
// Error function approximation for CDF
const erf = (x: number) => {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
};

const normalCDF = (x: number, mean: number, std: number) => {
  return 0.5 * (1 + erf((x - mean) / (std * Math.sqrt(2))));
};

export const HighSchoolModule: React.FC = () => {
  const [mode, setMode] = useState<Mode>('calculus');

  // Calculus State
  const [xVal, setXVal] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  // Stats State
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);
  const [statsHoverX, setStatsHoverX] = useState<number | null>(null);
  const statsRef = useRef<SVGSVGElement>(null);

  // Probability State
  const [dots, setDots] = useState<{x: number, y: number, inCircle: boolean}[]>([]);
  const [piEstimate, setPiEstimate] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  // Composition State
  const [compX, setCompX] = useState(1);
  const [outerFnIdx, setOuterFnIdx] = useState(0);
  const [innerFnIdx, setInnerFnIdx] = useState(1);

  const funcs = [
    { name: 'x²', label: 'x²', fn: (x: number) => x * x, color: 'text-pink-500', bg: 'bg-pink-500', border: 'border-pink-500' },
    { name: '2x', label: '2x', fn: (x: number) => 2 * x, color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500' },
    { name: 'x+2', label: 'x + 2', fn: (x: number) => x + 2, color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500' },
    { name: 'sin(x)', label: 'sin(x)', fn: (x: number) => Math.sin(x), color: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500' },
    { name: '|x|', label: '|x|', fn: (x: number) => Math.abs(x), color: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500' },
  ];

  // --- Calculus Interaction Logic ---
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
        if (!isDragging || !graphRef.current) return;
        const rect = graphRef.current.getBoundingClientRect();
        const w = rect.width;
        const scale = 30; // 1 unit = 30px
        const cx = w / 2;
        
        // Calculate X relative to center
        const mouseX = e.clientX - rect.left;
        let newX = (mouseX - cx) / scale;
        
        // Clamp xVal between -5 and 5
        newX = Math.max(-5, Math.min(5, newX));
        setXVal(newX);
    };

    const handleGlobalUp = () => {
        setIsDragging(false);
    };

    if (isDragging) {
        window.addEventListener('mousemove', handleGlobalMove);
        window.addEventListener('mouseup', handleGlobalUp);
    }
    return () => {
        window.removeEventListener('mousemove', handleGlobalMove);
        window.removeEventListener('mouseup', handleGlobalUp);
    };
  }, [isDragging]);

  const handleGraphMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      // Instant update on click
      if (!graphRef.current) return;
      const rect = graphRef.current.getBoundingClientRect();
      const w = rect.width;
      const scale = 30;
      const cx = w / 2;
      const mouseX = e.clientX - rect.left;
      let newX = (mouseX - cx) / scale;
      newX = Math.max(-5, Math.min(5, newX));
      setXVal(newX);
  };

  // Function: f(x) = 0.1 * x^2
  // Derivative: f'(x) = 0.2 * x
  const f = (x: number) => 0.1 * x * x;
  const df = (x: number) => 0.2 * x;

  const renderDerivativeGraph = () => {
    const w = 320;
    const h = 320;
    const scale = 30; // 1 unit = 30px
    const cx = w / 2;
    const cy = h - 50; // shift x-axis down

    // Draw Curve
    let pathD = `M 0 ${cy - f((0 - cx)/scale) * scale} `;
    for (let px = 0; px <= w; px+=5) {
        const xReal = (px - cx) / scale;
        const yReal = f(xReal);
        const py = cy - yReal * scale;
        pathD += `L ${px} ${py} `;
    }

    // Current Point
    const px = cx + xVal * scale;
    const py = cy - f(xVal) * scale;

    // Tangent Line: y - y1 = m(x - x1) => y = m(x - x1) + y1
    const m = df(xVal);
    // Calculate two points for line (far left and far right of graph)
    const xL = -6, xR = 6;
    const yL = m * (xL - xVal) + f(xVal);
    const yR = m * (xR - xVal) + f(xVal);
    const pLx = cx + xL * scale, pLy = cy - yL * scale;
    const pRx = cx + xR * scale, pRy = cy - yR * scale;

    // Transition config: Instant when dragging for responsiveness, Spring when clicking for smoothness
    const transitionConfig = isDragging 
        ? { type: "tween" as const, duration: 0 } 
        : { type: "spring" as const, stiffness: 200, damping: 25 };

    return (
        <div 
             ref={graphRef}
             className={`relative bg-white rounded-xl shadow-inner border-2 border-slate-200 w-[320px] h-[320px] overflow-hidden select-none touch-none transition-colors ${isDragging ? 'cursor-grabbing border-indigo-300' : 'cursor-grab hover:border-indigo-200'}`}
             onMouseDown={handleGraphMouseDown}
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: `${scale}px ${scale}px` }}></div>
            
            {/* Axes */}
            <div className="absolute w-full h-[1px] bg-slate-800" style={{top: cy}}></div>
            <div className="absolute h-full w-[1px] bg-slate-800" style={{left: cx}}></div>

            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" />
                
                {/* Tangent Line - Animated */}
                <motion.line 
                    animate={{ x1: pLx, y1: pLy, x2: pRx, y2: pRy }}
                    transition={transitionConfig}
                    stroke="#ec4899" strokeWidth="2" strokeDasharray="5,5" 
                />
                
                {/* Point - Animated */}
                <motion.g 
                    animate={{ x: px, y: py }}
                    transition={transitionConfig}
                >
                    <circle r="6" fill="#ec4899" className="drop-shadow-md" />
                    <circle r="12" fill="#ec4899" fillOpacity="0.2" className={isDragging ? 'animate-ping' : ''} />
                    
                    {/* Tooltip following point */}
                    {isDragging && (
                        <foreignObject x="-40" y="-45" width="80" height="30">
                           <div className="bg-slate-800 text-white text-[10px] rounded px-2 py-1 text-center font-bold shadow-lg">
                             x: {xVal.toFixed(1)}
                           </div>
                        </foreignObject>
                    )}
                </motion.g>
            </svg>

            {!isDragging && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-slate-500 shadow-sm border border-slate-200 flex items-center gap-1 pointer-events-none animate-pulse">
                    <MoveHorizontal size={12} /> 左右拖动图形
                </div>
            )}

            <div className="absolute top-2 right-2 bg-white/80 p-2 rounded text-xs font-mono shadow border pointer-events-none">
                x = {xVal.toFixed(2)}
            </div>
        </div>
    );
  };

  // --- Statistics Logic (Normal Distribution) ---
  const gaussian = (x: number, mu: number, sigma: number) => {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
  };

  const handleStatsMouseMove = (e: React.MouseEvent) => {
    if (!statsRef.current) return;
    const rect = statsRef.current.getBoundingClientRect();
    const w = rect.width;
    const scaleX = 40; 
    const cx = w / 2;
    const mouseX = e.clientX - rect.left;
    const xReal = (mouseX - cx) / scaleX;
    setStatsHoverX(xReal);
  };

  const renderNormalDist = () => {
     const w = 320, h = 200;
     const scaleX = 40; // 1 unit = 40px
     const scaleY = 300; // amplify y for visibility
     const cx = w / 2;
     const cy = h - 20;

     // Generate Main Curve Path
     let d = `M 0 ${cy} `;
     for (let px = 0; px <= w; px+=2) {
         const xReal = (px - cx) / scaleX;
         const yReal = gaussian(xReal, mean, stdDev);
         d += `L ${px} ${cy - yReal * scaleY} `;
     }
     d += `L ${w} ${cy} Z`;

     // Generate Highlight Area Path (if hovering)
     let highlightPath = '';
     if (statsHoverX !== null) {
        highlightPath = `M 0 ${cy} `;
        const endPx = cx + statsHoverX * scaleX;
        for (let px = 0; px <= endPx; px+=2) {
           const xReal = (px - cx) / scaleX;
           const yReal = gaussian(xReal, mean, stdDev);
           highlightPath += `L ${px} ${cy - yReal * scaleY} `;
        }
        // Ensure we close accurately at the cursor
        const yLast = gaussian(statsHoverX, mean, stdDev);
        highlightPath += `L ${endPx} ${cy - yLast * scaleY} L ${endPx} ${cy} Z`;
     }

     // Standard Deviation Markers
     const markers = [-2, -1, 0, 1, 2].map(sigma => {
         const val = mean + sigma * stdDev;
         const px = cx + val * scaleX;
         return { px, sigma, val };
     });

     return (
        <div className="relative group cursor-crosshair">
            <svg 
              ref={statsRef}
              width={w} height={h} 
              className="bg-white rounded-xl shadow-inner border border-slate-200 overflow-visible"
              onMouseMove={handleStatsMouseMove}
              onMouseLeave={() => setStatsHoverX(null)}
            >
                {/* Axis */}
                <line x1="0" y1={cy} x2={w} y2={cy} stroke="#cbd5e1" strokeWidth="2" />
                
                {/* SD Markers */}
                {markers.map((m, i) => (
                    <g key={i} className="pointer-events-none">
                        <line 
                          x1={m.px} y1="0" x2={m.px} y2={h} 
                          stroke={m.sigma === 0 ? "#94a3b8" : "#e2e8f0"} 
                          strokeWidth={m.sigma === 0 ? 2 : 1} 
                          strokeDasharray="4" 
                        />
                        <text x={m.px} y={h} textAnchor="middle" fontSize="10" fill="#94a3b8" dy="12">
                            {m.sigma === 0 ? 'μ' : `${m.sigma > 0 ? '+' : ''}${m.sigma}σ`}
                        </text>
                    </g>
                ))}

                {/* Main Curve */}
                <path d={d} fill="rgba(14, 165, 233, 0.1)" stroke="#0ea5e9" strokeWidth="2" />

                {/* Highlight Area */}
                {statsHoverX !== null && (
                    <path d={highlightPath} fill="rgba(14, 165, 233, 0.4)" stroke="none" />
                )}

                {/* Cursor Line */}
                {statsHoverX !== null && (
                    <line 
                      x1={cx + statsHoverX * scaleX} y1="0" 
                      x2={cx + statsHoverX * scaleX} y2={cy} 
                      stroke="#0284c7" strokeWidth="2"
                    />
                )}
            </svg>

            {/* Hover Tooltip */}
            {statsHoverX !== null && (
                <div 
                   className="absolute bg-slate-800/90 text-white text-xs p-3 rounded-lg pointer-events-none shadow-xl backdrop-blur-sm z-10"
                   style={{ 
                       left: Math.min(Math.max(0, cx + statsHoverX * scaleX), w - 120), // Clamp inside
                       top: 10 
                   }}
                >
                    <div className="font-bold mb-1 border-b border-slate-600 pb-1">x = {statsHoverX.toFixed(2)}</div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <span className="text-slate-400">Mean(μ):</span>
                        <span>{mean}</span>
                        <span className="text-slate-400">Z-Score:</span>
                        <span className="text-sky-400">{((statsHoverX - mean) / stdDev).toFixed(2)}</span>
                        <span className="text-slate-400">Prob(&lt;x):</span>
                        <span className="text-green-400 font-bold">{(normalCDF(statsHoverX, mean, stdDev) * 100).toFixed(1)}%</span>
                    </div>
                </div>
            )}
        </div>
     );
  };

  // --- Probability Logic (Monte Carlo Pi) ---
  const addPoints = () => {
    setIsSimulating(true);
    const newPoints = [];
    let inCount = 0;
    
    // Existing counts
    let totalIn = dots.filter(d => d.inCircle).length;
    let total = dots.length;

    for(let i=0; i<50; i++) {
        const x = Math.random() * 2 - 1; // -1 to 1
        const y = Math.random() * 2 - 1;
        const inCircle = (x*x + y*y) <= 1;
        newPoints.push({x, y, inCircle});
        if(inCircle) totalIn++;
        total++;
    }

    setDots(prev => [...prev, ...newPoints]);
    setPiEstimate(4 * (totalIn / total));
    setTimeout(() => setIsSimulating(false), 100);
  };

  const resetSim = () => {
      setDots([]);
      setPiEstimate(0);
  };

  // --- Composition Logic ---
  const renderCompGraph = () => {
    const outer = funcs[outerFnIdx];
    const inner = funcs[innerFnIdx];
    const composedFn = (x: number) => outer.fn(inner.fn(x));

    const w = 320;
    const h = 240;
    const scale = 25; 
    const cx = w / 2;
    const cy = h / 2;

    let pathD = `M 0 ${cy - composedFn((0 - cx)/scale) * scale} `;
    for (let px = 0; px <= w; px+=4) {
      const xReal = (px - cx) / scale;
      const yReal = composedFn(xReal);
      // Clamp for drawing
      if (Math.abs(yReal) < 10) {
         const py = cy - yReal * scale;
         pathD += `L ${px} ${py} `;
      }
    }

    const currentY = composedFn(compX);
    const px = cx + compX * scale;
    const py = cy - currentY * scale;

    return (
      <div className="relative bg-white rounded-xl shadow-inner border border-slate-200 w-full h-[240px] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: `${scale}px ${scale}px` }}></div>
        
        {/* Axes */}
        <div className="absolute w-full h-[1px] bg-slate-800" style={{top: cy}}></div>
        <div className="absolute h-full w-[1px] bg-slate-800" style={{left: cx}}></div>

        <svg className="absolute inset-0 w-full h-full overflow-visible">
           <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="3" />
           <circle cx={px} cy={py} r="6" fill="#ec4899" className="drop-shadow-md" />
           {/* Dashed lines to axis */}
           <line x1={px} y1={py} x2={px} y2={cy} stroke="#cbd5e1" strokeDasharray="4" />
           <line x1={px} y1={py} x2={cx} y2={py} stroke="#cbd5e1" strokeDasharray="4" />
        </svg>

        <div className="absolute top-2 right-2 text-xs font-mono bg-white/80 p-1 rounded shadow">
          y = {currentY.toFixed(2)}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-100 min-h-[500px]">
        {/* Header */}
        <div className="bg-slate-800 p-6 flex flex-col md:flex-row justify-between items-center text-white gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-3">
             <Activity className="w-8 h-8 text-indigo-400" /> 高中数学探索馆
          </h2>
          <div className="flex bg-slate-700/50 p-1 rounded-xl overflow-x-auto max-w-full">
             <button onClick={() => setMode('calculus')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'calculus' ? 'bg-indigo-500 text-white shadow' : 'text-slate-300 hover:bg-white/5'}`}>
               <MousePointerClick size={18} /> 微积分
             </button>
             <button onClick={() => setMode('comp')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'comp' ? 'bg-purple-500 text-white shadow' : 'text-slate-300 hover:bg-white/5'}`}>
               <Layers size={18} /> 复合函数
             </button>
             <button onClick={() => setMode('stats')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'stats' ? 'bg-sky-500 text-white shadow' : 'text-slate-300 hover:bg-white/5'}`}>
               <BarChart2 size={18} /> 统计
             </button>
             <button onClick={() => setMode('prob')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all whitespace-nowrap ${mode === 'prob' ? 'bg-green-500 text-white shadow' : 'text-slate-300 hover:bg-white/5'}`}>
               <Dices size={18} /> 概率
             </button>
          </div>
        </div>

        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-slate-50/50">
            
            {/* CALCULUS */}
            {mode === 'calculus' && (
                <div className="flex flex-col md:flex-row gap-12 items-center animate-in fade-in zoom-in duration-300">
                    <div className="flex flex-col items-center">
                        <div className="mb-4 text-center">
                            <h3 className="font-bold text-slate-700 text-lg">导数：瞬时变化率</h3>
                            <p className="text-slate-500 text-sm">拖动粉色点改变 x，观察切线斜率 (Slope)</p>
                        </div>
                        {renderDerivativeGraph()}
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 w-64">
                        <div className="mb-4 border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Function</span>
                            <div className="font-mono text-xl text-indigo-600 font-bold">f(x) = 0.1x²</div>
                        </div>
                        <div className="mb-4 border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">Point</span>
                            <div className="font-mono text-xl text-slate-700">x = {xVal.toFixed(2)}</div>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Slope (Derivative)</span>
                            <div className="font-mono text-3xl text-pink-500 font-black">
                                {df(xVal).toFixed(2)}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">f'(x) = 0.2x</div>
                        </div>
                    </div>
                </div>
            )}

            {/* COMPOSITION */}
            {mode === 'comp' && (
              <div className="flex flex-col w-full max-w-4xl gap-8 animate-in fade-in zoom-in duration-300">
                 
                 {/* Top Controls: Pipeline */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center bg-white p-6 rounded-3xl shadow-sm border border-purple-100">
                    
                    {/* Input */}
                    <div className="flex flex-col items-center gap-2">
                       <span className="text-sm font-bold text-slate-400 uppercase">Input (x)</span>
                       <div className="text-3xl font-black text-slate-700 bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
                          {compX}
                       </div>
                       <input 
                          type="range" min="-4" max="4" step="0.5" 
                          value={compX} onChange={(e) => setCompX(parseFloat(e.target.value))}
                          className="w-full accent-purple-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
                        />
                    </div>

                    {/* Pipeline */}
                    <div className="col-span-1 lg:col-span-2 flex flex-col items-center">
                       <div className="flex items-center gap-2 w-full justify-center mb-6">
                          
                          {/* Inner Function G */}
                          <div className={`relative px-6 py-4 rounded-xl border-4 ${funcs[innerFnIdx].border} bg-white shadow-lg flex flex-col items-center`}>
                             <span className="absolute -top-3 bg-white px-2 text-xs font-bold text-slate-400">g(x) 内层</span>
                             <select 
                               value={innerFnIdx} 
                               onChange={(e) => setInnerFnIdx(Number(e.target.value))}
                               className={`font-black text-xl outline-none bg-transparent cursor-pointer ${funcs[innerFnIdx].color}`}
                             >
                               {funcs.map((f, i) => <option key={i} value={i}>{f.label}</option>)}
                             </select>
                             <div className="mt-2 font-mono text-sm text-slate-500">
                                g({compX}) = <span className="font-bold">{funcs[innerFnIdx].fn(compX).toFixed(2)}</span>
                             </div>
                          </div>

                          <ArrowRight className="text-slate-300 animate-pulse" size={32} />

                          {/* Outer Function F */}
                          <div className={`relative px-6 py-4 rounded-xl border-4 ${funcs[outerFnIdx].border} bg-white shadow-lg flex flex-col items-center`}>
                             <span className="absolute -top-3 bg-white px-2 text-xs font-bold text-slate-400">f(u) 外层</span>
                             <select 
                               value={outerFnIdx} 
                               onChange={(e) => setOuterFnIdx(Number(e.target.value))}
                               className={`font-black text-xl outline-none bg-transparent cursor-pointer ${funcs[outerFnIdx].color}`}
                             >
                               {funcs.map((f, i) => <option key={i} value={i}>{f.label}</option>)}
                             </select>
                             <div className="mt-2 font-mono text-sm text-slate-500">
                                f({funcs[innerFnIdx].fn(compX).toFixed(2)})
                             </div>
                          </div>

                          <ArrowRight className="text-slate-300" size={32} />
                          
                          {/* Result */}
                          <div className="flex flex-col items-center">
                             <div className="text-3xl font-black text-purple-600 bg-purple-50 px-4 py-2 rounded-xl border-2 border-purple-200">
                                {funcs[outerFnIdx].fn(funcs[innerFnIdx].fn(compX)).toFixed(2)}
                             </div>
                             <span className="text-xs font-bold text-purple-400 mt-1">Output (y)</span>
                          </div>

                       </div>
                       
                       <p className="text-slate-400 text-sm text-center">
                          复合函数 <span className="font-mono font-bold text-slate-600">y = f(g(x))</span> 就像工厂流水线，x 先经过 g 加工，结果再送入 f 加工。
                       </p>
                    </div>

                 </div>

                 {/* Graph */}
                 <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <div className="w-full md:w-[400px]">
                       {renderCompGraph()}
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                       <h4 className="font-bold text-slate-700 mb-2">当前函数式:</h4>
                       <div className="text-xl font-mono text-slate-600 mb-4 bg-slate-100 p-3 rounded-lg">
                          y = {funcs[outerFnIdx].label.replace('x', `(${funcs[innerFnIdx].label})`)}
                       </div>
                       <ul className="space-y-2 text-sm text-slate-500">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            内层: <span className={`${funcs[innerFnIdx].color} font-bold`}>{funcs[innerFnIdx].label}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                            外层: <span className={`${funcs[outerFnIdx].color} font-bold`}>{funcs[outerFnIdx].label}</span>
                          </li>
                       </ul>
                    </div>
                 </div>

              </div>
            )}

            {/* STATISTICS */}
            {mode === 'stats' && (
                <div className="flex flex-col md:flex-row gap-12 items-center animate-in fade-in zoom-in duration-300">
                    <div className="flex flex-col items-center">
                        <div className="mb-6 text-center">
                            <h3 className="font-bold text-slate-700 text-lg">正态分布 (Normal Distribution)</h3>
                            <p className="text-slate-500 text-sm">
                               鼠标悬停可查看 <span className="text-sky-500 font-bold">Z-Score</span> 和 <span className="text-green-500 font-bold">累计概率</span>
                            </p>
                        </div>
                        {renderNormalDist()}
                    </div>
                    <div className="w-64 space-y-6">
                        <div className="bg-white p-5 rounded-2xl shadow border border-sky-100">
                            <label className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                                均值 (μ) <span className="text-sky-600">{mean}</span>
                            </label>
                            <input 
                                type="range" min="-3" max="3" step="0.1" 
                                value={mean} onChange={(e) => setMean(parseFloat(e.target.value))}
                                className="w-full accent-sky-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-slate-400 mt-2">决定曲线中心位置</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow border border-sky-100">
                            <label className="flex justify-between text-sm font-bold text-slate-500 mb-2">
                                标准差 (σ) <span className="text-sky-600">{stdDev}</span>
                            </label>
                            <input 
                                type="range" min="0.5" max="3" step="0.1" 
                                value={stdDev} onChange={(e) => setStdDev(parseFloat(e.target.value))}
                                className="w-full accent-sky-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-slate-400 mt-2">决定数据的离散程度（胖瘦）</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PROBABILITY */}
            {mode === 'prob' && (
                <div className="flex flex-col md:flex-row gap-12 items-center animate-in fade-in zoom-in duration-300">
                    <div className="flex flex-col items-center">
                         <div className="mb-4 text-center">
                            <h3 className="font-bold text-slate-700 text-lg">蒙特卡洛模拟求 π</h3>
                            <p className="text-slate-500 text-sm">向正方形内随机撒点，估算圆周率</p>
                        </div>
                        <div className="relative w-[300px] h-[300px] bg-white border-2 border-slate-800 shadow-xl overflow-hidden">
                            {/* Circle Boundary */}
                            <div className="absolute inset-0 rounded-full border-2 border-green-500/50 pointer-events-none"></div>
                            
                            {/* Dots */}
                            {dots.map((d, i) => (
                                <div key={i} className={`absolute w-1 h-1 rounded-full ${d.inCircle ? 'bg-green-500' : 'bg-slate-300'}`}
                                     style={{ 
                                         left: `${(d.x + 1) / 2 * 100}%`, 
                                         top: `${(d.y + 1) / 2 * 100}%` 
                                     }}
                                />
                            ))}
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button 
                                onClick={addPoints} disabled={isSimulating}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-lg active:scale-95 transition-transform flex items-center gap-2"
                            >
                                <Dices size={18} /> 撒入 50 个点
                            </button>
                            <button 
                                onClick={resetSim}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-4 py-2 rounded-full font-bold active:scale-95 transition-transform"
                            >
                                <RefreshCcw size={18} /> 重置
                            </button>
                        </div>
                    </div>
                    
                    <div className="w-64 space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Total Points</span>
                            <div className="text-2xl font-black text-slate-700">{dots.length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-100">
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">In Circle</span>
                            <div className="text-2xl font-black text-green-600">{dots.filter(d => d.inCircle).length}</div>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 text-center">
                            <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Estimated π</span>
                            <div className="text-4xl font-mono font-black text-green-400">{piEstimate.toFixed(5)}</div>
                            <div className="text-xs text-slate-500 mt-2 border-t border-slate-600 pt-2">True π ≈ 3.14159...</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
