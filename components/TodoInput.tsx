
import React, { useState } from 'react';
import { Priority } from '../types';

interface TodoInputProps {
  onAdd: (text: string, priority: Priority) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority);
    setText('');
    setPriority(Priority.Medium);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          {text.trim() && (
            <button
              type="button"
              onClick={() => setText('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
            >
              <i className="fas fa-times-circle"></i>
            </button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
            {Object.values(Priority).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  priority === p 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full md:w-auto px-8 py-3 bg-slate-800 text-white font-semibold rounded-2xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoInput;
