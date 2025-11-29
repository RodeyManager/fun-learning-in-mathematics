
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Shapes, Ruler, Triangle, Square, Circle, Diamond, GitGraph, Cylinder, Cone, Move } from 'lucide-react';
import { ShapeData } from '../types';

// Reusable Drag Handle Component
const DragHandle: React.FC<{
  x: number;
  y: number;
  onDrag: (e: any, info: any) => void;
  axis?: 'x' | 'y' | 'both';
  label?: string;
}> = ({ x, y, onDrag, axis = 'both', label }) => {
  return (
    <motion.div
      drag={axis === 'both' ? true : axis}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Constraints are 0 because we update state manually
      onDrag={onDrag}
      className="absolute w-6 h-6 bg-white border-4 border-pink-500 rounded-full shadow-lg flex items-center justify-center cursor-move z-20 hover:scale-125 transition-transform"
      style={{ left: x - 12, top: y - 12 }} // Center the handle
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 1.1, cursor: "grabbing" }}
    >
      {label && (
        <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          {label}
        </div>
      )}
      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
    </motion.div>
  );
};

export const GeometryModule: React.FC = () => {
  const [shape, setShape] = useState<ShapeData['type']>('rectangle');
  
  // Dimensions (States)
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [radius, setRadius] = useState(3);

  const UNIT = 40; 
  const MAX_W = 10;
  const MAX_H = 8;
  const MIN = 1.5;

  // Grid Pattern CSS for shapes
  const gridPatternStyle = {
    backgroundImage: `linear-gradient(#ec489933 1px, transparent 1px), linear-gradient(90deg, #ec489933 1px, transparent 1px)`,
    backgroundSize: `${UNIT}px ${UNIT}px`
  };

  // Reset dimensions when shape changes for better UX
  useEffect(() => {
    if (shape === 'circle') setRadius(3);
    else {
        setWidth(4);
        setHeight(3);
    }
  }, [shape]);

  const updateDimension = (setter: React.Dispatch<React.SetStateAction<number>>, current: number, delta: number, maxVal: number = 8) => {
    const newVal = current + delta / UNIT;
    // Snap to 0.5
    const snapped = Math.round(newVal * 2) / 2;
    setter(Math.max(MIN, Math.min(maxVal, snapped)));
  };

  const getArea = () => {
    switch(shape) {
      case 'rectangle': return (width * height).toFixed(1);
      case 'triangle': return ((width * height) / 2).toFixed(1);
      case 'parallelogram': return (width * height).toFixed(1);
      case 'circle': return (Math.PI * radius * radius).toFixed(2);
      case 'pythagorean': return (width * width + height * height).toFixed(2);
      case 'cylinder': return (Math.PI * (width/2)**2 * height).toFixed(2); // width is diameter here effectively for consistent UI, but let's treat width as radius for cylinder logic usually? Let's stick to standard w/h controls mapping
      case 'cone': return ((1/3) * Math.PI * (width/2)**2 * height).toFixed(2);
      default: return 0;
    }
  };

  const getFormula = () => {
    switch(shape) {
      case 'rectangle': return `长 × 宽 = ${width} × ${height}`;
      case 'triangle': return `底 × 高 ÷ 2 = ${width} × ${height} ÷ 2`;
      case 'parallelogram': return `底 × 高 = ${width} × ${height}`;
      case 'circle': return `π × r² ≈ 3.14 × ${radius}²`;
      case 'pythagorean': return `a² + b² = c²`;
      case 'cylinder': return `πr²h (r=${width/2})`; // Simplified mapping
      case 'cone': return `1/3 πr²h`;
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-pink-100 min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-pink-500 p-6 flex flex-col xl:flex-row justify-between items-center text-white gap-4">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Shapes className="w-8 h-8" /> 图形建造师
          </h2>
          
          <div className="flex bg-pink-700/30 p-1 rounded-xl gap-1 overflow-x-auto max-w-full no-scrollbar">
             {[
               {id: 'rectangle', icon: <Square size={16} />, label: '长方形'},
               {id: 'triangle', icon: <Triangle size={16} />, label: '三角形'},
               {id: 'parallelogram', icon: <Diamond size={16} />, label: '平行四边形'},
               {id: 'circle', icon: <Circle size={16} />, label: '圆'},
               {id: 'pythagorean', icon: <GitGraph size={16} />, label: '勾股'},
               {id: 'cylinder', icon: <Cylinder size={16} />, label: '圆柱'},
               {id: 'cone', icon: <Cone size={16} />, label: '圆锥'},
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setShape(item.id as any)}
                 className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-bold whitespace-nowrap transition-all ${shape === item.id ? 'bg-white text-pink-600 shadow-lg' : 'text-pink-100 hover:bg-white/10'}`}
               >
                 {item.icon} {item.label}
               </button>
             ))}
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 flex-1">
          
          {/* Visualization Area */}
          <div className="flex-1 bg-slate-50 rounded-3xl border-2 border-slate-200 relative min-h-[400px] flex items-center justify-center overflow-hidden shadow-inner select-none">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" 
                 style={{ 
                   backgroundImage: `linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)`, 
                   backgroundSize: `${UNIT}px ${UNIT}px` 
                 }}>
            </div>

            <div className="relative">
               {/* ---------------- RECTANGLE ---------------- */}
               {shape === 'rectangle' && (
                 <>
                   <motion.div 
                     className="bg-pink-400/20 border-4 border-pink-500 relative"
                     style={{ width: width * UNIT, height: height * UNIT, ...gridPatternStyle }}
                   />
                   {/* Handle: Bottom-Right */}
                   <DragHandle 
                      x={width * UNIT} y={height * UNIT} 
                      onDrag={(e, i) => {
                        updateDimension(setWidth, width, i.delta.x, MAX_W);
                        updateDimension(setHeight, height, i.delta.y, MAX_H);
                      }}
                      label="拖动调整"
                   />
                 </>
               )}

               {/* ---------------- TRIANGLE ---------------- */}
               {shape === 'triangle' && (
                 <div style={{ width: width * UNIT, height: height * UNIT }} className="relative border-b-4 border-pink-500">
                   {/* The Shape */}
                   <svg className="w-full h-full overflow-visible absolute top-0 left-0 pointer-events-none">
                     <path d={`M 0 ${height * UNIT} L ${width * UNIT} ${height * UNIT} L ${width/2 * UNIT} 0 Z`} fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="0" />
                     <line x1={width/2 * UNIT} y1="0" x2={width/2 * UNIT} y2={height * UNIT} stroke="#ec4899" strokeDasharray="4" />
                     {/* Sides */}
                     <line x1="0" y1={height * UNIT} x2={width/2 * UNIT} y2="0" stroke="#ec4899" strokeWidth="4" />
                     <line x1={width * UNIT} y1={height * UNIT} x2={width/2 * UNIT} y2="0" stroke="#ec4899" strokeWidth="4" />
                   </svg>
                   
                   {/* Handle: Width (Bottom Right) */}
                   <DragHandle 
                      x={width * UNIT} y={height * UNIT} axis="x"
                      onDrag={(e, i) => updateDimension(setWidth, width, i.delta.x, MAX_W)}
                      label="底"
                   />
                   {/* Handle: Height (Top Center) */}
                   <DragHandle 
                      x={width/2 * UNIT} y={0} axis="y"
                      onDrag={(e, i) => updateDimension(setHeight, height, -i.delta.y, MAX_H)} // Invert Y because dragging UP increases height
                      label="高"
                   />
                 </div>
               )}

               {/* ---------------- PARALLELOGRAM ---------------- */}
               {shape === 'parallelogram' && (
                 <div style={{ width: (width + 2) * UNIT, height: height * UNIT }} className="relative">
                   <svg className="w-full h-full overflow-visible pointer-events-none">
                     <path d={`M ${1 * UNIT} ${height * UNIT} L ${(width + 1) * UNIT} ${height * UNIT} L ${(width + 2) * UNIT} 0 L ${2 * UNIT} 0 Z`} fill="rgba(236, 72, 153, 0.2)" stroke="#ec4899" strokeWidth="4" />
                      <line x1={2 * UNIT} y1="0" x2={2 * UNIT} y2={height * UNIT} stroke="#ec4899" strokeDasharray="4" />
                   </svg>

                   {/* Handle: Width (Base) */}
                   <DragHandle 
                      x={(width + 1) * UNIT} y={height * UNIT} axis="x"
                      onDrag={(e, i) => updateDimension(setWidth, width, i.delta.x, MAX_W)}
                      label="底"
                   />
                   {/* Handle: Height */}
                   <DragHandle 
                      x={(width + 2) * UNIT} y={0} axis="y"
                      onDrag={(e, i) => updateDimension(setHeight, height, -i.delta.y, MAX_H)}
                      label="高"
                   />
                 </div>
               )}

               {/* ---------------- CIRCLE ---------------- */}
               {shape === 'circle' && (
                 <div className="relative flex items-center justify-center">
                    <motion.div 
                      className="bg-pink-400/20 border-4 border-pink-500 rounded-full"
                      style={{ width: radius * 2 * UNIT, height: radius * 2 * UNIT }}
                    />
                    {/* Radius Line */}
                    <div className="absolute h-0.5 bg-pink-600 origin-left" style={{ width: radius * UNIT, left: '50%' }}></div>
                    
                    {/* Handle: Radius (Right edge) */}
                    <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
                        <DragHandle 
                           x={radius * UNIT} y={0} axis="x"
                           onDrag={(e, i) => updateDimension(setRadius, radius, i.delta.x, 5)}
                           label="半径"
                        />
                    </div>
                 </div>
               )}

               {/* ---------------- PYTHAGOREAN ---------------- */}
               {shape === 'pythagorean' && (
                 <div className="relative pt-20 pl-20">
                    <svg className="overflow-visible pointer-events-none">
                        <path d={`M 0 ${height*UNIT} L ${width*UNIT} ${height*UNIT} L 0 0 Z`} fill="#fef08a" stroke="#eab308" strokeWidth="3" />
                    </svg>

                    {/* Square a (Vertical Leg) */}
                    <div className="absolute top-0 -left-[2px] bg-red-400/20 border-2 border-red-500 flex items-center justify-center text-red-700 font-bold origin-bottom-right"
                         style={{ width: height * UNIT, height: height * UNIT, transform: 'translateX(-100%)', top: 0 }}>
                        <span className="text-lg">a²</span>
                    </div>
                    {/* Square b (Horizontal Leg) */}
                    <div className="absolute bg-blue-400/20 border-2 border-blue-500 flex items-center justify-center text-blue-700 font-bold origin-top-left"
                         style={{ width: width * UNIT, height: width * UNIT, top: height * UNIT, left: 0 }}>
                        <span className="text-lg">b²</span>
                    </div>

                    {/* Handle for A (Height) */}
                    <DragHandle 
                       x={0} y={0} axis="y"
                       onDrag={(e, i) => updateDimension(setHeight, height, -i.delta.y, 5)}
                       label="a"
                    />

                    {/* Handle for B (Width) */}
                    <DragHandle 
                       x={width * UNIT} y={height * UNIT} axis="x"
                       onDrag={(e, i) => updateDimension(setWidth, width, i.delta.x, 5)}
                       label="b"
                    />
                 </div>
               )}

               {/* ---------------- CYLINDER ---------------- */}
               {shape === 'cylinder' && (
                 <div className="relative flex flex-col items-center">
                    {/* Top Ellipse */}
                    <div className="bg-pink-300 border-2 border-pink-600 rounded-[100%] absolute top-0 z-10"
                         style={{ width: width * UNIT, height: (width * UNIT) * 0.3 }}></div>
                    
                    {/* Body */}
                    <div className="bg-pink-200/50 border-x-2 border-pink-600 absolute top-0"
                         style={{ width: width * UNIT, height: height * UNIT, top: (width * UNIT) * 0.15 }}></div>
                    
                    {/* Bottom Ellipse */}
                    <div className="bg-pink-300 border-2 border-pink-600 rounded-[100%] absolute"
                         style={{ width: width * UNIT, height: (width * UNIT) * 0.3, top: height * UNIT }}></div>

                    {/* Container for Handles size */}
                    <div style={{ width: width * UNIT, height: height * UNIT + (width*UNIT)*0.3 }} className="relative pointer-events-none"></div>

                    <div className="absolute top-0 right-0 translate-x-1/2">
                       <DragHandle 
                          x={width * UNIT / 2} y={(width*UNIT)*0.15} axis="x"
                          onDrag={(e, i) => updateDimension(setWidth, width, i.delta.x * 2, 6)} // *2 because width is diameter here
                          label="直径"
                       />
                    </div>
                     <div className="absolute bottom-0 right-1/2">
                       <DragHandle 
                          x={0} y={height * UNIT} axis="y"
                          onDrag={(e, i) => updateDimension(setHeight, height, i.delta.y, 6)}
                          label="高"
                       />
                    </div>
                 </div>
               )}

               {/* ---------------- CONE ---------------- */}
               {shape === 'cone' && (
                 <div className="relative" style={{ width: width * UNIT, height: height * UNIT + (width * UNIT * 0.3) }}>
                    {/* SVG Layer */}
                    <svg width="100%" height="100%" className="overflow-visible absolute top-0 left-0">
                        {/* Base Ellipse (Visual depth) */}
                        <ellipse cx={width * UNIT / 2} cy={height * UNIT} rx={width * UNIT / 2} ry={(width * UNIT * 0.3)/2} fill="rgba(236, 72, 153, 0.4)" stroke="#db2777" strokeWidth="2" />
                        
                        {/* Triangle Body */}
                        <path d={`M ${width * UNIT / 2} 0 L 0 ${height * UNIT} L ${width * UNIT} ${height * UNIT} Z`} fill="rgba(236, 72, 153, 0.2)" stroke="#db2777" strokeWidth="2" />
                        
                        {/* Center Height Line */}
                        <line x1={width * UNIT / 2} y1="0" x2={width * UNIT / 2} y2={height * UNIT} stroke="#db2777" strokeDasharray="4" />
                    </svg>

                    {/* Handle: Diameter (Bottom Right) */}
                    <DragHandle 
                       x={width * UNIT} y={height * UNIT} axis="x"
                       onDrag={(e, i) => updateDimension(setWidth, width, i.delta.x * 2, 6)}
                       label="直径"
                    />

                    {/* Handle: Height (Top Center) */}
                    <DragHandle 
                       x={width * UNIT / 2} y={0} axis="y"
                       onDrag={(e, i) => updateDimension(setHeight, height, -i.delta.y, 6)}
                       label="高"
                    />
                 </div>
               )}

            </div>
          </div>

          {/* Controls */}
          <div className="w-full md:w-64 space-y-6 flex flex-col justify-center">
            
            <div className="bg-pink-50 p-5 rounded-2xl border border-pink-100">
              <h3 className="font-bold text-pink-800 mb-4 flex items-center gap-2">
                <Ruler className="w-4 h-4" /> 调整参数
              </h3>
              
              <div className="space-y-4">
                 {/* Radius / Width Control */}
                 {(shape === 'circle' || shape === 'cylinder' || shape === 'cone') && (
                    <div>
                      <label className="flex justify-between text-sm font-bold text-slate-500 mb-1">
                        <span>{shape === 'circle' ? '半径 (Radius)' : '直径 (Diameter)'}</span>
                        <span className="text-pink-600">{shape === 'circle' ? radius : width}</span>
                      </label>
                      <input 
                        type="range" min={MIN} max={6} step="0.5" 
                        value={shape === 'circle' ? radius : width} 
                        onChange={(e) => shape === 'circle' ? setRadius(parseFloat(e.target.value)) : setWidth(parseFloat(e.target.value))}
                        className="w-full accent-pink-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                 )}

                 {/* Width / Base Control (for non-circular) */}
                 {!['circle', 'cylinder', 'cone'].includes(shape) && (
                    <div>
                      <label className="flex justify-between text-sm font-bold text-slate-500 mb-1">
                        <span>{shape === 'pythagorean' ? '底边 b' : (shape === 'triangle' || shape === 'parallelogram' ? '底' : '长')}</span>
                        <span className="text-pink-600">{width}</span>
                      </label>
                      <input 
                        type="range" min={MIN} max={MAX_W} step="0.5" 
                        value={width} 
                        onChange={(e) => setWidth(parseFloat(e.target.value))}
                        className="w-full accent-pink-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                 )}

                 {/* Height Control (for non-circle) */}
                 {shape !== 'circle' && (
                    <div>
                      <label className="flex justify-between text-sm font-bold text-slate-500 mb-1">
                        <span>{shape === 'pythagorean' ? '直角边 a' : (shape === 'triangle' || shape === 'parallelogram' ? '高' : '宽')}</span>
                        <span className="text-pink-600">{height}</span>
                      </label>
                      <input 
                        type="range" min={MIN} max={MAX_H} step="0.5" 
                        value={height} 
                        onChange={(e) => setHeight(parseFloat(e.target.value))}
                        className="w-full accent-pink-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                 )}
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Move size={12} />
                <span>你可以直接拖动图上的圆点哦！</span>
              </div>
            </div>

            <div className="bg-white border-2 border-yellow-200 p-6 rounded-2xl text-center shadow-lg transform transition-all hover:scale-105">
               <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-2">
                 {shape === 'pythagorean' ? '斜边计算 (c)' : shape === 'cylinder' || shape === 'cone' ? '体积 (Volume)' : '面积 (Area)'}
               </p>
               <p className="text-4xl font-black text-yellow-500 mb-2 font-mono">
                  {getArea()}
               </p>
               <div className="bg-yellow-50 py-2 px-3 rounded-lg text-xs text-yellow-800 font-mono inline-block border border-yellow-100">
                 {getFormula()}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
