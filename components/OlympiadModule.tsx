
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Scroll, Sword, Sparkles, ArrowRight, History, BookOpen, 
  ChevronRight, CheckCircle2, Lightbulb, GraduationCap, Medal, 
  Crown, Landmark, Map, Volume2, StopCircle, Variable, Repeat, 
  Fingerprint, Zap 
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface OlympiadProblem {
  title: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  background?: string;
}

export const OlympiadModule: React.FC = () => {
  const [grade, setGrade] = useState(6);
  const [category, setCategory] = useState<'logic' | 'number' | 'geometry' | 'combinatorics' | 'algebra' | 'sequences' | 'invariants'>('logic');
  const [problem, setProblem] = useState<OlympiadProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Refs for robust drag handling
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'logic', name: '逻辑推理', icon: <Sword size={16} />, desc: '思维的迷宫' },
    { id: 'number', name: '数论奇境', icon: <History size={16} />, desc: '质数的奥秘' },
    { id: 'geometry', name: '几何秘法', icon: <BookOpen size={16} />, desc: '图形的语言' },
    { id: 'algebra', name: '代数神殿', icon: <Variable size={16} />, desc: '未知的力量' },
    { id: 'sequences', name: '数列迷阵', icon: <Repeat size={16} />, desc: '数字的律动' },
    { id: 'combinatorics', name: '组合博弈', icon: <Sparkles size={16} />, desc: '胜负的策略' },
    { id: 'invariants', name: '奇偶领域', icon: <Fingerprint size={16} />, desc: '不变的真理' },
  ];

  const gradeGroups = [
    { name: '启蒙馆', range: [1, 2, 3, 4, 5, 6], icon: <GraduationCap size={18} />, sub: '小学基础', color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: '进阶馆', range: [7, 8, 9], icon: <Medal size={18} />, sub: '初中挑战', color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: '巅峰馆', range: [10, 11, 12], icon: <Crown size={18} />, sub: '高中奥林匹克', color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  // TTS Logic
  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    if (!problem) return;

    if (isSpeaking) {
      stopSpeaking();
    } else {
      const utterance = new SpeechSynthesisUtterance(problem.question);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85; 
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleCategoryChange = (newCat: any) => {
    if (newCat !== category) {
      setCategory(newCat);
      setProblem(null);
      setFeedback(null);
      setSelectedOption(null);
      stopSpeaking();
    }
  };

  const fetchOlympiadProblem = async () => {
    stopSpeaking();
    setLoading(true);
    setProblem(null);
    setFeedback(null);
    setSelectedOption(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `作为一个奥数专家，请为 ${grade} 年级的学生生成一道经典的“${category}”类型的奥数题。
        题目背景：${categories.find(c => c.id === category)?.desc}。
        如果是经典古题（如鸡兔同笼、百钱买百鸡等），请在 background 中说明背景。
        题目难度要高，具有挑战性。
        
        Return ONLY a JSON object:
        {
          "title": "题目简短名称",
          "question": "题目详细描述（中文）",
          "options": ["A: ...", "B: ...", "C: ...", "D: ..."],
          "answer": "正确选项的完整字符串",
          "explanation": "详细的解题逻辑解析（中文）",
          "background": "相关的历史背景或数学典故（可选）"
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              background: { type: Type.STRING },
            },
            required: ["title", "question", "options", "answer", "explanation"]
          }
        }
      });

      const text = response.text;
      if (text) {
        setProblem(JSON.parse(text));
      }
    } catch (error) {
      console.error("Olympiad fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    if (!problem || !selectedOption) return;
    setFeedback(selectedOption === problem.answer ? 'correct' : 'wrong');
  };

  const getGradeLabel = (g: number) => {
    if (g <= 6) return `${g}年级`;
    if (g <= 9) return `初${g - 6}`;
    return `高${g - 9}`;
  };

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || "数学";
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-[#fdf6e3] rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-amber-900/10 min-h-[800px] flex flex-col relative">
        
        {/* Card Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-900 to-yellow-950 p-6 md:p-8 text-white relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 opacity-10 rotate-12 translate-x-1/4 -translate-y-1/4">
             <Landmark size={200} />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/20 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                <Trophy className="w-10 h-10 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black font-serif tracking-tight text-white">奥数博物馆</h2>
                <p className="text-amber-200/60 text-sm font-medium tracking-widest uppercase flex items-center gap-2">
                   <Sparkles size={14} /> 逻辑与智慧的殿堂
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* Left Sidebar - Grade Selector */}
          <aside className="w-full lg:w-72 bg-amber-50/50 border-r border-amber-900/10 p-6 flex flex-col gap-8 shrink-0">
             <div className="flex items-center gap-2 mb-2">
                <Map size={18} className="text-amber-800" />
                <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">展馆导览</h3>
             </div>

             <div className="flex flex-col gap-8">
                {gradeGroups.map((group) => (
                   <div key={group.name} className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl bg-white shadow-sm ${group.color}`}>
                            {group.icon}
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-amber-950">{group.name}</h4>
                            <p className="text-[10px] text-amber-800/50 uppercase font-black tracking-tighter">{group.sub}</p>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                         {group.range.map((g) => (
                           <button
                             key={g}
                             onClick={() => {
                               setGrade(g);
                               setProblem(null);
                               setFeedback(null);
                               setSelectedOption(null);
                               stopSpeaking();
                             }}
                             className={`h-12 rounded-xl flex items-center justify-center font-bold text-xs transition-all relative border-2
                               ${grade === g 
                                 ? 'bg-amber-800 border-amber-900 text-amber-50 shadow-lg scale-105 z-10' 
                                 : 'bg-white border-amber-900/5 text-amber-900/60 hover:border-amber-900/20 hover:text-amber-900'
                               }
                             `}
                           >
                             {getGradeLabel(g)}
                             {grade === g && (
                                <motion.div layoutId="active-dot" className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-amber-800" />
                             )}
                           </button>
                         ))}
                      </div>
                   </div>
                ))}
             </div>

             <div className="mt-auto pt-8 border-t border-amber-900/10">
                <div className="bg-amber-900/5 p-4 rounded-2xl">
                   <p className="text-[11px] text-amber-800 font-medium italic leading-relaxed">
                     “数学不只是公式，它是思考的方式。”
                   </p>
                </div>
             </div>
          </aside>

          {/* Main Problem Area */}
          <section className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] relative overflow-hidden">
            
            {/* Horizontal Category Picker - PC FIXED Drag */}
            <div 
              ref={containerRef}
              className="relative border-b border-amber-900/10 bg-amber-50/60 sticky top-0 z-20 overflow-hidden select-none shrink-0"
            >
              {/* Visual Decorative Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-amber-50 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-amber-50 to-transparent z-10 pointer-events-none" />

              {/* The Draggable Wrapper */}
              <motion.div 
                layout
                drag="x"
                dragConstraints={containerRef}
                dragElastic={0.1}
                dragMomentum={true}
                whileTap={{ cursor: 'grabbing' }}
                className="flex gap-3 p-4 px-12 cursor-grab w-max flex-nowrap"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onPointerDown={(e) => e.stopPropagation()} // Allow button to be clicked even inside drag container
                    onClick={() => handleCategoryChange(cat.id as any)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border
                      ${category === cat.id 
                        ? 'bg-amber-800 text-white shadow-md border-amber-900 ring-4 ring-amber-800/10' 
                        : 'text-amber-800 hover:bg-amber-800/10 bg-white/90 border-amber-900/10'
                      }
                    `}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Problem Content Container - FIXED Strict Horizontal Centering */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar flex flex-col items-center w-full">
              <AnimatePresence mode="wait">
                {!problem && !loading && (
                  <motion.div 
                    key={`empty-${category}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col items-center justify-center text-center space-y-8 w-full max-w-4xl"
                  >
                     <div className="relative">
                        <motion.div
                          animate={{ rotate: [0, -3, 3, 0], scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 6 }}
                        >
                          <Scroll size={120} className="text-amber-800/10" />
                        </motion.div>
                        <Landmark className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-800/5" size={160} />
                     </div>
                     <div className="max-w-md mx-auto">
                        <h3 className="text-3xl font-serif font-black text-amber-900 mb-4 tracking-tight">
                            唤醒 {getCategoryName(category)} 的智慧
                        </h3>
                        <p className="text-amber-800/60 mb-12 leading-relaxed font-medium italic text-lg">
                          您已选择进入 <span className="text-amber-800 font-bold not-italic">{getGradeLabel(grade)}</span> 的 <span className="text-amber-800 font-bold not-italic">{getCategoryName(category)}</span> 展厅。
                        </p>
                        <button 
                          onClick={fetchOlympiadProblem}
                          className="group relative bg-amber-800 hover:bg-amber-900 text-white px-12 py-5 rounded-2xl font-bold shadow-2xl transition-all active:scale-95 border-b-4 border-amber-950 flex items-center gap-4 mx-auto text-lg overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          <Sparkles size={24} className="group-hover:rotate-12 transition-transform" /> 
                          揭开馆藏难题
                        </button>
                     </div>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col items-center justify-center space-y-6 w-full max-w-4xl"
                  >
                     <div className="relative">
                       <div className="w-24 h-24 border-8 border-amber-200 border-t-amber-800 rounded-full animate-spin shadow-xl"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <History className="text-amber-800 animate-pulse" size={32} />
                       </div>
                     </div>
                     <div className="text-center">
                        <p className="text-amber-900 font-serif font-black text-xl italic mb-1">正在检索 {getCategoryName(category)} 典籍...</p>
                        <p className="text-amber-800/40 text-sm font-bold uppercase tracking-widest">Searching Archives</p>
                     </div>
                  </motion.div>
                )}

                {problem && (
                  <motion.div 
                    key={`problem-${category}-${problem.title}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-8 w-full max-w-4xl mx-auto"
                  >
                    {/* Background Story */}
                    {problem.background && (
                      <div className="bg-amber-900/5 border-l-8 border-amber-800 p-6 rounded-r-3xl text-sm md:text-base text-amber-950 font-serif italic shadow-sm relative overflow-hidden group w-full">
                        <div className="absolute -right-4 -bottom-4 text-amber-900/5 group-hover:scale-110 transition-transform">
                           <History size={100} />
                        </div>
                        <div className="flex items-center gap-3 mb-3 font-bold not-italic text-amber-900 uppercase tracking-widest text-xs">
                          <div className="bg-amber-800 text-white p-1 rounded-md">
                             <History size={12} />
                          </div>
                          历史典故
                        </div>
                        <p className="relative z-10 leading-relaxed">{problem.background}</p>
                      </div>
                    )}

                    {/* Problem Card */}
                    <div className="bg-white/70 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-amber-900/5 relative group transition-all hover:bg-white/90 w-full">
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-amber-800 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl rotate-[-12deg] group-hover:rotate-0 transition-transform z-10">
                        ?
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl md:text-4xl font-serif font-black text-amber-950 mb-6 leading-tight">
                          {problem.title}
                        </h3>
                        <p className="text-xl md:text-2xl text-amber-900/90 leading-relaxed font-medium mb-6">
                          {problem.question}
                        </p>
                        <button 
                            onClick={toggleSpeech}
                            className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all border-2 mx-auto md:mx-0 ${
                                isSpeaking 
                                ? 'bg-amber-800 text-white border-amber-900 shadow-lg animate-pulse' 
                                : 'bg-amber-50 text-amber-800 border-amber-800/20 hover:bg-amber-100 hover:border-amber-800/40'
                            }`}
                        >
                            {isSpeaking ? (
                                <><StopCircle size={18} /> 停止讲述</>
                            ) : (
                                <><Volume2 size={18} /> 聆听典籍</>
                            )}
                        </button>
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {problem.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => !feedback && setSelectedOption(opt)}
                          disabled={!!feedback}
                          className={`group p-6 rounded-[1.5rem] border-2 text-left font-bold transition-all flex items-center gap-5
                            ${feedback 
                               ? (opt === problem.answer ? 'bg-green-100 border-green-500 text-green-700' : (opt === selectedOption ? 'bg-red-100 border-red-500 text-red-700 opacity-100 shadow-inner' : 'bg-white/30 border-transparent opacity-40'))
                               : (selectedOption === opt ? 'bg-amber-800 border-amber-900 text-amber-50 shadow-2xl scale-[1.02] z-10' : 'bg-white/80 border-amber-900/10 text-amber-900 hover:border-amber-900/30 hover:bg-white')
                            }
                          `}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 transition-colors shadow-sm ${selectedOption === opt ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800 group-hover:bg-amber-200'}`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="flex-1 text-lg">{opt}</span>
                        </button>
                      ))}
                    </div>

                    {/* Action Button */}
                    {!feedback && (
                      <div className="mt-8 flex justify-center w-full">
                        <button 
                          onClick={checkAnswer}
                          disabled={!selectedOption}
                          className={`px-20 py-5 rounded-[1.5rem] font-black shadow-2xl transition-all active:scale-95 text-lg flex items-center gap-4
                            ${selectedOption 
                               ? 'bg-amber-800 text-amber-50 hover:bg-amber-900 scale-105' 
                               : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }
                          `}
                        >
                          提交我的见解 <ChevronRight size={24} />
                        </button>
                      </div>
                    )}

                    {/* Explanation Section */}
                    <AnimatePresence>
                      {feedback && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-amber-900/10 relative overflow-hidden w-full"
                        >
                           <div className={`absolute top-0 right-0 p-8 opacity-5 pointer-events-none ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                              {feedback === 'correct' ? <CheckCircle2 size={120} /> : <Crown size={120} />}
                           </div>
                           
                           <div className="flex items-center gap-6 mb-8 relative z-10">
                              {feedback === 'correct' 
                                ? <div className="p-4 bg-green-100 rounded-2xl shadow-inner"><CheckCircle2 className="text-green-600" size={40} /></div>
                                : <div className="p-4 bg-amber-100 rounded-2xl shadow-inner"><Lightbulb className="text-amber-600" size={40} /></div>
                              }
                              <div>
                                <h4 className={`text-2xl md:text-3xl font-black ${feedback === 'correct' ? 'text-green-800' : 'text-amber-900'}`}>
                                  {feedback === 'correct' ? '逻辑严整，真理彰显！' : '再思其道，必有所悟。'}
                                </h4>
                                <p className="text-sm text-slate-400 mt-1 font-bold uppercase tracking-widest">正确答案：{problem.answer}</p>
                              </div>
                           </div>
                           
                           <div className="bg-amber-50/70 p-8 rounded-3xl border border-amber-200/50 relative z-10 w-full">
                              <div className="flex items-center gap-3 mb-4">
                                 <Lightbulb size={24} className="text-yellow-500" />
                                 <span className="font-black text-amber-950 uppercase tracking-widest text-sm">解题秘法</span>
                              </div>
                              <div className="text-amber-900/80 leading-relaxed text-lg md:text-xl font-medium whitespace-pre-line">
                                 {problem.explanation}
                              </div>
                           </div>

                           <div className="mt-12 pt-8 border-t border-amber-900/10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 w-full">
                              <div className="flex items-center gap-2 text-amber-800/40 text-sm font-bold animate-pulse">
                                 <Sparkles size={16} /> 继续探索下一个难题...
                              </div>
                              <button 
                                onClick={fetchOlympiadProblem}
                                className="w-full md:w-auto bg-amber-800 text-amber-50 px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-amber-900 transition-all shadow-xl active:scale-95"
                              >
                                 下一部卷轴 <ArrowRight size={20} />
                              </button>
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
