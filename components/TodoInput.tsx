
import React, { useState } from 'react';
import { Priority } from '../types';
import { suggestPriority } from '../services/geminiService';

interface TodoInputProps {
  onAdd: (text: string, priority: Priority) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, Priority.Medium);
    setText('');
  };

  const handleSmartAdd = async () => {
    if (!text.trim()) return;
    setIsSuggesting(true);
    const suggested = await suggestPriority(text);
    onAdd(text, suggested);
    setText('');
    setIsSuggesting(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
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
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex-1 md:flex-none px-6 py-3 bg-slate-800 text-white font-semibold rounded-2xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={handleSmartAdd}
            disabled={!text.trim() || isSuggesting}
            className="px-4 py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-2xl hover:bg-indigo-100 transition-colors flex items-center gap-2 border border-indigo-100 disabled:opacity-50"
          >
            <i className={`fas ${isSuggesting ? 'fa-circle-notch fa-spin' : 'fa-bolt'}`}></i>
            <span className="hidden sm:inline">Smart Priority</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoInput;
