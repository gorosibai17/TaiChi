import React from 'react';
import { motion } from 'motion/react';
import { Play, Clock, ChevronRight } from 'lucide-react';
import { Exercise } from '../data/exercises';

interface TaiChiCardProps {
  exercise: Exercise;
  onClick: () => void;
}

export function TaiChiCard({ exercise, onClick }: TaiChiCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-brand-olive/5 group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={exercise.imageUrl}
          alt={exercise.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold text-brand-olive border border-brand-olive/10">
            {exercise.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-serif leading-tight">{exercise.title}</h3>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 font-sans">
          {exercise.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{exercise.duration}</span>
            </div>
            <div className="px-2 py-0.5 bg-brand-cream rounded text-brand-olive">
              {exercise.difficulty}
            </div>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-brand-olive text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={18} fill="currentColor" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
