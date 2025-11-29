
import React, { useState } from 'react';
import { AppView, Topic } from './types';
import { TopicCard } from './components/TopicCard';
import { ArithmeticModule } from './components/ArithmeticModule';
import { GeometryModule } from './components/GeometryModule';
import { FractionModule } from './components/FractionModule';
import { WordProblemModule } from './components/WordProblemModule';
import { JuniorHighModule } from './components/JuniorHighModule';
import { HighSchoolModule } from './components/HighSchoolModule';
import { AITutor } from './components/AITutor';
import { Calculator, Shapes, PieChart, Bot, Home, Star, BrainCircuit, Variable, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const topics: Topic[] = [
  {
    id: AppView.ARITHMETIC,
    title: '算术大冒险',
    description: '1-9 年级全覆盖！从简单加减到负数运算。',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    icon: 'calculator'
  },
  {
    id: AppView.WORD_PROBLEMS,
    title: '应用题挑战',
    description: '理解性数学训练！AI 老师出题，覆盖中小学所有年级。',
    color: 'bg-gradient-to-br from-orange-400 to-red-500',
    icon: 'brain'
  },
  {
    id: AppView.GEOMETRY,
    title: '图形建造师',
    description: '从基础图形到初中勾股定理，直观学习！',
    color: 'bg-gradient-to-br from-pink-500 to-rose-600',
    icon: 'shapes'
  },
  {
    id: AppView.JUNIOR_MATH,
    title: '初中数学实验室',
    description: '代数、函数与三角函数的可视化探索！',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    icon: 'variable'
  },
  {
    id: AppView.HIGH_SCHOOL_MATH,
    title: '高中数学探索馆',
    description: '微积分导数、正态分布统计与蒙特卡洛概率。',
    color: 'bg-gradient-to-br from-slate-600 to-slate-800',
    icon: 'activity'
  },
  {
    id: AppView.FRACTIONS,
    title: '披萨分数',
    description: '切分披萨、比较大小、学习分数加法。',
    color: 'bg-gradient-to-br from-teal-400 to-emerald-600',
    icon: 'pie'
  },
  {
    id: AppView.AI_TUTOR,
    title: '问问数学小博士',
    description: '和我们的 AI 老师聊天，解决难题。',
    color: 'bg-gradient-to-br from-violet-600 to-fuchsia-700',
    icon: 'bot'
  }
];

const getIcon = (name: string) => {
    switch(name) {
        case 'calculator': return <Calculator className="w-full h-full" />;
        case 'shapes': return <Shapes className="w-full h-full" />;
        case 'pie': return <PieChart className="w-full h-full" />;
        case 'bot': return <Bot className="w-full h-full" />;
        case 'brain': return <BrainCircuit className="w-full h-full" />;
        case 'variable': return <Variable className="w-full h-full" />;
        case 'activity': return <Activity className="w-full h-full" />;
        default: return null;
    }
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-200">
      
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView(AppView.HOME)}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">
              数学<span className="text-indigo-600">奇幻乐园</span>
            </h1>
          </div>

          {currentView !== AppView.HOME && (
            <button 
              onClick={() => setCurrentView(AppView.HOME)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 transition-colors"
            >
              <Home size={18} />
              <span>首页</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          
          {/* Home Grid */}
          {currentView === AppView.HOME && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                  中小学数学<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">全能助手</span> 🚀
                </h2>
                <p className="text-xl text-slate-500">覆盖 1-12 年级知识点，AI 智能辅助学习！</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <TopicCard 
                    key={topic.id}
                    {...topic}
                    icon={getIcon(topic.icon)}
                    onClick={setCurrentView}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Modules */}
          {currentView === AppView.ARITHMETIC && (
            <motion.div key="arithmetic" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -100}}>
              <ArithmeticModule />
            </motion.div>
          )}
          
          {currentView === AppView.WORD_PROBLEMS && (
            <motion.div key="word_problems" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -100}}>
              <WordProblemModule />
            </motion.div>
          )}

          {currentView === AppView.GEOMETRY && (
            <motion.div key="geometry" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -100}}>
              <GeometryModule />
            </motion.div>
          )}

          {currentView === AppView.JUNIOR_MATH && (
            <motion.div key="junior_math" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -100}}>
              <JuniorHighModule />
            </motion.div>
          )}
          
          {currentView === AppView.HIGH_SCHOOL_MATH && (
            <motion.div key="high_school_math" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -100}}>
              <HighSchoolModule />
            </motion.div>
          )}

          {currentView === AppView.FRACTIONS && (
            <motion.div key="fractions" initial={{opacity: 0, x: 100}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: -100}}>
              <FractionModule />
            </motion.div>
          )}

          {currentView === AppView.AI_TUTOR && (
            <motion.div key="tutor" initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.9}}>
              <AITutor />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} 数学奇幻乐园. 快乐学习.</p>
      </footer>
    </div>
  );
}
