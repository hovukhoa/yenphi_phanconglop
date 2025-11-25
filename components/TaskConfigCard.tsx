import React from 'react';
import { TaskConfig } from '../types';
import { Users } from 'lucide-react';

interface TaskConfigCardProps {
  task: TaskConfig;
  onChange: (id: string, count: number) => void;
}

export const TaskConfigCard: React.FC<TaskConfigCardProps> = ({ task, onChange }) => {
  const handleDecrement = () => {
    if (task.requiredCount > 0) {
      onChange(task.id, task.requiredCount - 1);
    }
  };

  const handleIncrement = () => {
    onChange(task.id, task.requiredCount + 1);
  };

  return (
    <div className={`p-4 rounded-xl border-2 flex items-center justify-between ${task.color}`}>
      <div className="flex items-center space-x-3">
        <Users size={20} />
        <span className="font-semibold text-lg">{task.name}</span>
      </div>
      
      <div className="flex items-center space-x-3 bg-white/50 p-1 rounded-lg">
        <button 
          onClick={handleDecrement}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-gray-50 text-gray-700 font-bold transition-colors shadow-sm"
          aria-label="Decrease count"
        >
          -
        </button>
        <span className="w-6 text-center font-bold text-lg">{task.requiredCount}</span>
        <button 
          onClick={handleIncrement}
          className="w-8 h-8 flex items-center justify-center rounded-md bg-white hover:bg-gray-50 text-gray-700 font-bold transition-colors shadow-sm"
          aria-label="Increase count"
        >
          +
        </button>
      </div>
    </div>
  );
};