
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Check, X, RefreshCcw, Layers } from 'lucide-react';

type Operation = '+' | '-' | '×' | '÷';

export const ArithmeticModule: React.FC = () => {
  // Config State
  const [grade, setGrade] = useState(1);
  const [operation, setOperation] = useState<Operation>('+');
  
  // Problem State
  const [problemDisplay, setProblemDisplay] = useState<{ n1: string | number, n2: string | number, op: string }>({ n1: 0, n2: 0, op: '+' });
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hint, setHint] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateProblem();
  }, [grade, operation]);

  // Auto-focus input when problem changes or feedback is cleared/wrong
  useEffect(() => {
    if (feedback !== 'correct') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [problemDisplay, feedback]);

  // Helper: Random Integer
  const r = (max: number) => Math.floor(Math.random() * max);
  // Helper: Random Integer with Min/Max
  const rRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  // Helper: Random Decimal (1 decimal place)
  const rd1 = (max: number) => parseFloat((Math.random() * max).toFixed(1));
  // Helper: Random Decimal (2 decimal places)
  const rd2 = (max: number) => parseFloat((Math.random() * max).toFixed(2));
  // Helper: Random Choice
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const generateProblem = () => {
    let n1: number | string = 0;
    let n2: number | string = 0;
    let ans = 0;
    let currentHint = "";

    // Grade-based Logic
    // Grade 1-2: Visual/Simple
    // Grade 3-4: Multi-digit
    // Grade 5-6: Decimals
    // Grade 7-9: Negative numbers (Rational numbers)

    const isGrade6Fraction = grade === 6 && Math.random() > 0.5;

    if (isGrade6Fraction) {
      // Grade 6 Fraction Logic
      const fractions = [
        { num: 1, den: 2, val: 0.5, s: "1/2" },
        { num: 1, den: 4, val: 0.25, s: "1/4" },
        { num: 3, den: 4, val: 0.75, s: "3/4" },
        { num: 1, den: 5, val: 0.2, s: "1/5" },
        { num: 2, den: 5, val: 0.4, s: "2/5" },
        { num: 1, den: 10, val: 0.1, s: "1/10" }
      ];

      const f1 = pick(fractions);
      const f2 = pick(fractions);

      n1 = f1.s;
      n2 = f2.s;
      
      switch (operation) {
        case '+': ans = f1.val + f2.val; break;
        case '-': 
          if (f1.val >= f2.val) { ans = f1.val - f2.val; } 
          else { n1 = f2.s; n2 = f1.s; ans = f2.val - f1.val; }
          break;
        case '×': ans = f1.val * f2.val; break;
        case '÷': ans = f1.val / f2.val; break;
      }
      currentHint = "请将分数化为小数计算结果";

    } else {
      let val1 = 0;
      let val2 = 0;

      // Grade 7-9: Allow negative numbers
      const allowNegative = grade >= 7;

      switch (operation) {
        case '+':
          if (grade === 1) { val1 = r(18)+1; val2 = r(20 - val1)+1; }
          else if (grade === 2) { val1 = r(80)+10; val2 = r(99 - val1)+1; }
          else if (grade === 3) { val1 = r(800)+100; val2 = r(800)+100; }
          else if (grade === 4) { val1 = r(8000)+1000; val2 = r(8000)+1000; }
          else if (grade === 5) { val1 = rd1(50); val2 = rd1(50); }
          else if (grade === 6) { val1 = rd2(100); val2 = rd2(100); }
          else if (grade >= 7) { 
             val1 = rRange(-50, 50); 
             val2 = rRange(-50, 50); 
             if (val2 < 0) currentHint = "注意负号变号规则";
          }
          ans = val1 + val2;
          break;
        case '-':
          if (grade === 1) { val1 = r(15)+5; val2 = r(val1-1)+1; }
          else if (grade === 2) { val1 = r(90)+10; val2 = r(val1-5)+1; }
          else if (grade === 3) { val1 = r(900)+100; val2 = r(val1-50)+10; }
          else if (grade === 4) { val1 = r(9000)+1000; val2 = r(val1-100)+100; }
          else if (grade === 5) { val1 = rd1(50); val2 = rd1(val1); }
          else if (grade === 6) { val1 = rd2(100); val2 = rd2(val1); }
          else if (grade >= 7) {
             val1 = rRange(-50, 50); 
             val2 = rRange(-50, 50); 
          }
          ans = val1 - val2;
          break;
        case '×':
          if (grade <= 2) { val1 = r(8)+1; val2 = r(8)+1; }
          else if (grade === 3) { val1 = r(90)+10; val2 = r(8)+2; }
          else if (grade === 4) { val1 = r(900)+100; val2 = r(90)+10; }
          else if (grade === 5) { val1 = rd1(10); val2 = r(9)+1; }
          else if (grade === 6) { val1 = rd1(10); val2 = rd1(10); }
          else if (grade >= 7) {
             val1 = rRange(-20, 20); 
             val2 = rRange(-10, 10);
          }
          ans = val1 * val2;
          break;
        case '÷':
          if (grade <= 2) { 
             val2 = r(8)+2; ans = r(8)+1; val1 = val2 * ans;
          } else if (grade === 3) {
             val2 = r(8)+2; ans = r(20)+10; val1 = val2 * ans;
          } else if (grade === 4) {
             val2 = r(20)+10; ans = r(50)+10; val1 = val2 * ans;
          } else if (grade >= 5 && grade <= 6) {
             if (grade === 5) { ans = rd1(10); val2 = r(9)+2; val1 = parseFloat((ans * val2).toFixed(1)); } 
             else { val2 = r(15)+5; val1 = r(100)+20; ans = val1 / val2; }
          } else if (grade >= 7) {
             // Integer Division with negatives
             ans = rRange(-20, 20);
             if (ans === 0) ans = 1;
             val2 = rRange(-10, 10);
             if (val2 === 0) val2 = 2;
             val1 = ans * val2;
          }
          break;
      }
      n1 = val1;
      n2 = val2;
    }

    setProblemDisplay({ n1, n2, op: operation });
    setCorrectAnswer(ans);
    setHint(currentHint);
    setUserAnswer('');
    setFeedback(null);
  };

  const checkAnswer = () => {
    const userVal = parseFloat(userAnswer);
    if (isNaN(userVal)) return;

    // Allow small floating point error epsilon
    const isCorrect = Math.abs(userVal - correctAnswer) < 0.01;

    if (isCorrect) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  };

  // Visual mode is only for integers in Grade 1-2
  const isVisualMode = grade <= 2 && typeof problemDisplay.n1 === 'number' && problemDisplay.n1 <= 20 && typeof problemDisplay.n2 === 'number' && problemDisplay.n2 <= 20 && problemDisplay.n1 > 0 && problemDisplay.n2 > 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-indigo-100 min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-xl">
               <Layers className="w-6 h-6" />
             </div>
             <h2 className="text-2xl md:text-3xl font-bold">算术大冒险</h2>
          </div>
          
          <div className="flex gap-2 bg-indigo-800/50 p-1 rounded-xl">
             {(['+', '-', '×', '÷'] as Operation[]).map(op => (
               <button
                 key={op}
                 onClick={() => setOperation(op)}
                 className={`w-10 h-10 rounded-lg font-black text-xl flex items-center justify-center transition-all ${operation === op ? 'bg-white text-indigo-600 shadow-lg scale-110' : 'text-indigo-200 hover:bg-white/10'}`}
               >
                 {op}
               </button>
             ))}
          </div>

          <div className="flex items-center gap-2 bg-indigo-800/50 p-2 rounded-xl overflow-x-auto max-w-full">
             <span className="text-xs font-bold text-indigo-200 uppercase whitespace-nowrap">年级</span>
             <div className="flex gap-1">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => (
                 <button 
                   key={g}
                   onClick={() => setGrade(g)}
                   className={`w-8 h-8 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${grade === g ? 'bg-indigo-400 text-white shadow ring-2 ring-white' : 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-700'}`}
                 >
                   {g}
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="p-4 md:p-8 flex-1 flex flex-col justify-center">
          
          {/* Visualization Area */}
          {isVisualMode && (
             <div className="bg-slate-50 rounded-3xl p-6 min-h-[160px] flex flex-col items-center justify-center mb-8 relative border-2 border-slate-100 shadow-inner">
                {operation === '+' && (
                  <div className="flex gap-8 items-center flex-wrap justify-center">
                    <div className="grid grid-cols-5 gap-1">
                       {Array.from({length: Math.floor(problemDisplay.n1 as number)}).map((_, i) => <Apple key={i} className="w-6 h-6 text-red-500 fill-current" />)}
                    </div>
                    <span className="text-3xl text-slate-300 font-black">+</span>
                    <div className="grid grid-cols-5 gap-1">
                       {Array.from({length: Math.floor(problemDisplay.n2 as number)}).map((_, i) => <Apple key={i} className="w-6 h-6 text-green-500 fill-current" />)}
                    </div>
                  </div>
                )}
                {operation === '×' && (
                   <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${problemDisplay.n2}, 1fr)`}}>
                      {Array.from({length: (problemDisplay.n1 as number) * (problemDisplay.n2 as number)}).map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-indigo-100 rounded-sm border border-indigo-200"></div>
                      ))}
                   </div>
                )}
                {!['+', '×'].includes(operation) && (
                   <div className="text-slate-400 font-medium">看数字算一算！</div>
                )}
             </div>
          )}

          {/* Abstract/Calculation Area */}
          {!isVisualMode && (
             <div className="bg-slate-50 rounded-3xl p-8 mb-8 relative border-2 border-slate-100 shadow-inner flex justify-center items-center min-h-[200px]">
                <div className="font-mono text-5xl md:text-7xl text-slate-700 font-bold tracking-wider flex flex-col items-end gap-2 border-b-4 border-slate-800 pr-8 pb-4">
                   <div className="flex items-center gap-4">
                      {/* Special styling for fraction text if it's a string, or negative numbers */}
                      <span className={typeof problemDisplay.n1 === 'string' || (problemDisplay.n1 as number) < 0 ? "text-indigo-600 font-sans" : ""}>
                         {(problemDisplay.n1 as number) < 0 ? `(${problemDisplay.n1})` : problemDisplay.n1}
                      </span>
                   </div>
                   <div className="flex items-center gap-6">
                      <span className="text-indigo-500">{operation}</span>
                      <span className={typeof problemDisplay.n2 === 'string' || (problemDisplay.n2 as number) < 0 ? "text-indigo-600 font-sans" : ""}>
                         {(problemDisplay.n2 as number) < 0 ? `(${problemDisplay.n2})` : problemDisplay.n2}
                      </span>
                   </div>
                </div>
                {hint && (
                   <div className="absolute top-4 right-4 text-xs font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-lg">
                     💡 {hint}
                   </div>
                )}
             </div>
          )}

          {/* Feedback Overlay */}
          <AnimatePresence>
              {feedback === 'correct' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-white p-10 rounded-3xl flex flex-col items-center shadow-2xl">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl mb-4">
                        <Check className="w-12 h-12 text-white" strokeWidth={4} />
                      </div>
                    </motion.div>
                    <h3 className="text-3xl font-black text-green-600 mb-6">答对了！</h3>
                    <button onClick={() => generateProblem()} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 flex items-center gap-2">
                      <RefreshCcw size={20} /> 下一题
                    </button>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="flex flex-col items-center gap-6">
            {!isVisualMode && <div className="text-slate-400 text-sm">输入答案（支持小数和负数）</div>}
            
            <div className="flex flex-col md:flex-row items-center gap-4">
               {isVisualMode && (
                 <div className="text-4xl font-black text-slate-700 flex items-center gap-3">
                   <span>{problemDisplay.n1}</span>
                   <span className="text-indigo-500">{operation}</span>
                   <span>{problemDisplay.n2}</span>
                   <span>=</span>
                 </div>
               )}
               
               <input 
                 ref={inputRef}
                 type="number"
                 step="0.01"
                 value={userAnswer}
                 onChange={(e) => setUserAnswer(e.target.value)}
                 className="w-40 h-20 text-center text-4xl font-black border-4 border-indigo-200 rounded-2xl focus:border-indigo-500 outline-none text-indigo-600 bg-white shadow-inner"
                 placeholder="?"
                 onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
               />

               <button 
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                  className={`px-8 py-6 rounded-2xl text-xl font-bold text-white shadow-xl transition-all active:scale-95 ${!userAnswer ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-300/50'}`}
                >
                  检查
                </button>
            </div>
            
            {feedback === 'wrong' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-500 px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                <X size={20} /> 哎呀，再试一次！
                {grade >= 5 && <span className="text-xs font-normal ml-2">(注意保留两位小数)</span>}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
