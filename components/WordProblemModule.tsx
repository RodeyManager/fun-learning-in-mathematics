
import React, { useState, useEffect } from 'react';
import { generateWordProblem, WordProblem } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, CheckCircle2, XCircle, ArrowRight, BrainCircuit, Check, X, Volume2, StopCircle, Keyboard } from 'lucide-react';

export const WordProblemModule: React.FC = () => {
  const [grade, setGrade] = useState(1);
  const [problem, setProblem] = useState<WordProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fetchProblem = async () => {
    stopSpeaking(); // Stop any existing speech
    setLoading(true);
    setProblem(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setFeedback(null);
    
    const result = await generateWordProblem(grade);
    setProblem(result);
    setLoading(false);
  };

  // Handle grade switching: Reset everything to avoid mismatch
  const handleGradeChange = (newGrade: number) => {
    stopSpeaking();
    setGrade(newGrade);
    setProblem(null);
    setSelectedOption(null);
    setShowExplanation(false);
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!problem || !selectedOption) return;
    
    const isCorrect = selectedOption === problem.answer;
    
    if (isCorrect) {
      setFeedback('correct');
      setShowExplanation(true);
    } else {
      setFeedback('wrong');
      setShowExplanation(true); 
    }
  };

  // TTS Logic
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleSpeech = () => {
    if (!problem) return;

    if (isSpeaking) {
      stopSpeaking();
    } else {
      const utterance = new SpeechSynthesisUtterance(problem.question);
      utterance.lang = 'zh-CN'; // Chinese
      utterance.rate = 0.9; // Slightly slower for clarity
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;

      // Enter Key Behavior
      if (e.key === 'Enter') {
        if (!problem) {
          fetchProblem();
        } else if (problem && !feedback && selectedOption) {
          checkAnswer();
        } else if (feedback) {
          fetchProblem();
        }
        return;
      }

      // Option Selection (1-4 or A-D)
      if (problem && !feedback) {
        const key = e.key.toLowerCase();
        const map = ['1', '2', '3', '4', 'a', 'b', 'c', 'd'];
        const idx = map.indexOf(key);
        
        if (idx !== -1) {
          const optionIndex = idx % 4; // Map 0-3 and 4-7 to 0-3
          if (optionIndex < problem.options.length) {
            setSelectedOption(problem.options[optionIndex]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, problem, feedback, selectedOption, grade]); // Dependencies ensure fresh state in closure

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getOptionStyle = (option: string, idx: number) => {
    // Base style
    let base = "w-full p-4 rounded-xl border-2 text-lg font-bold transition-all relative overflow-hidden flex items-center gap-4 ";
    
    if (feedback) {
      // Result State
      if (option === problem?.answer) {
        return base + "bg-green-100 border-green-500 text-green-700 shadow-md"; // Always highlight correct answer
      }
      if (option === selectedOption && option !== problem?.answer) {
        return base + "bg-red-100 border-red-500 text-red-700 opacity-80"; // Highlight wrong selection
      }
      return base + "bg-slate-50 border-slate-200 text-slate-400 opacity-50"; // Dim others
    } else {
      // Selection State
      if (option === selectedOption) {
        return base + "bg-orange-100 border-orange-500 text-orange-700 shadow-md scale-[1.02]";
      }
      return base + "bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50";
    }
  };

  const getBadgeStyle = (option: string) => {
      if (feedback) {
          if (option === problem?.answer) return "bg-green-500 text-white border-green-600";
          if (option === selectedOption) return "bg-red-500 text-white border-red-600";
          return "bg-slate-200 text-slate-400 border-slate-300";
      }
      if (option === selectedOption) return "bg-orange-500 text-white border-orange-600";
      return "bg-slate-100 text-slate-500 border-slate-200";
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-orange-100 min-h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-orange-500 p-6 text-white flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="bg-white/20 p-2 rounded-xl">
               <BrainCircuit className="w-8 h-8" />
             </div>
             <h2 className="text-2xl md:text-3xl font-bold">应用题挑战</h2>
          </div>
          
          <div className="flex items-center gap-2 bg-orange-600/30 p-2 rounded-xl overflow-x-auto max-w-full">
             <span className="font-bold text-orange-100 text-sm whitespace-nowrap">年级:</span>
             <div className="flex gap-1">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                 <button
                   key={g}
                   onClick={() => handleGradeChange(g)}
                   className={`px-2 h-8 rounded-lg font-bold transition-all text-sm whitespace-nowrap ${grade === g ? 'bg-white text-orange-600 shadow-lg scale-105' : 'text-orange-200 hover:bg-white/10'}`}
                 >
                   {g <= 6 ? `${g}年级` : g <= 9 ? `初${g-6}` : `高${g-9}`}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 flex-1 flex flex-col items-center justify-center relative bg-slate-50">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-200 via-yellow-200 to-orange-200"></div>

          {!problem && !loading && (
            <div className="text-center max-w-md">
              <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-400">
                <BookOpen size={64} />
              </div>
              <motion.div
                key={grade} // Re-animate on grade change
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h3 className="text-2xl font-bold text-slate-700 mb-2">
                  {grade <= 6 ? `小学 ${grade} 年级数学` : grade <= 9 ? `初中 ${grade-6} 年级数学` : `高中 ${grade-9} 年级数学`}
                </h3>
                <p className="text-slate-500 mb-8">准备好接受挑战了吗？这里的题目需要你动动脑筋，读懂题目再选择正确答案哦！</p>
                <button 
                  onClick={fetchProblem}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold px-10 py-4 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Sparkles /> 出一道题 <span className="text-xs bg-orange-700/30 px-2 py-0.5 rounded text-orange-50 font-normal ml-1">↵ Enter</span>
                </button>
              </motion.div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center animate-pulse">
               <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
               <p className="text-orange-500 font-bold">数学小博士正在思考题目...</p>
            </div>
          )}

          {problem && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-orange-100"
            >
              <div className="flex gap-4 mb-8">
                <div className="bg-orange-100 text-orange-600 font-black text-xl px-4 py-2 rounded-xl h-fit shrink-0">Q</div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-3">
                    {problem.question}
                  </h3>
                  <button 
                    onClick={toggleSpeech}
                    className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-all ${
                        isSpeaking 
                        ? 'bg-orange-500 text-white shadow-md animate-pulse' 
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    {isSpeaking ? (
                        <><StopCircle size={16} /> 停止朗读</>
                    ) : (
                        <><Volume2 size={16} /> 朗读题目</>
                    )}
                  </button>
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pl-0 md:pl-16">
                {problem.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => !feedback && setSelectedOption(option)}
                    disabled={!!feedback}
                    className={getOptionStyle(option, idx)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border shrink-0 ${getBadgeStyle(option)}`}>
                        {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1 text-left flex items-center justify-between">
                      <span>{option}</span>
                      {feedback && option === problem.answer && <Check className="w-6 h-6 text-green-600 shrink-0" />}
                      {feedback && option === selectedOption && option !== problem.answer && <X className="w-6 h-6 text-red-600 shrink-0" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit Button (Only show if no feedback yet) */}
              {!feedback && (
                <div className="flex flex-col md:flex-row justify-between items-center pl-0 md:pl-16 gap-4">
                  <div className="text-xs text-slate-300 font-bold flex items-center gap-1">
                    <Keyboard size={14} /> 快捷键: A/B/C/D 选择, Enter 确认
                  </div>
                  <button 
                    onClick={checkAnswer}
                    disabled={!selectedOption}
                    className={`font-bold px-8 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2
                      ${selectedOption 
                        ? 'bg-slate-800 hover:bg-slate-900 text-white scale-100' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed scale-95'}`}
                  >
                    提交答案
                    {selectedOption && <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-normal">↵ Enter</span>}
                  </button>
                </div>
              )}

              {/* Explanation / Result */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`mt-6 p-6 rounded-2xl border-l-4 overflow-hidden ${feedback === 'correct' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {feedback === 'correct' ? <CheckCircle2 className="text-green-600" /> : <XCircle className="text-red-600" />}
                      <h4 className={`font-bold ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                        {feedback === 'correct' ? '太棒了！答对了！' : '哎呀，选错了。来看看解析吧：'}
                      </h4>
                    </div>
                    
                    <div className="text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-200/50 pt-4 mt-2">
                       <span className="font-bold text-slate-500 block mb-2 text-sm">💡 小博士解析:</span>
                       {problem.explanation}
                    </div>

                    <div className="mt-6 flex justify-end">
                       <button 
                         onClick={fetchProblem}
                         className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-orange-200 transition-all flex items-center gap-2"
                       >
                         下一题 <ArrowRight size={18} />
                         <span className="text-xs bg-orange-700/30 px-2 py-0.5 rounded text-orange-50 font-normal">↵ Enter</span>
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};
