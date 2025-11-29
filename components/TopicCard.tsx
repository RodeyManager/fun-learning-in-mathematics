import React from 'react';
import { AppView } from '../types';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface TopicCardProps {
  id: AppView;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  onClick: (id: AppView) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ id, title, description, color, icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      className={`${color} p-6 rounded-3xl shadow-xl cursor-pointer flex flex-col justify-between h-64 text-white relative overflow-hidden`}
      onClick={() => onClick(id)}
    >
      <div className="absolute -right-5 -top-5 opacity-20 transform scale-150">
        {icon}
      </div>
      
      <div className="z-10">
        <div className="mb-4 bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-white/90 font-medium">{description}</p>
      </div>

      <div className="flex items-center gap-2 font-bold z-10 mt-auto">
        <span>开始学习</span>
        <ArrowRight size={20} />
      </div>
    </motion.div>
  );
};