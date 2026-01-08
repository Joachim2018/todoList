
import React, { useEffect, useState } from 'react';
import { Todo } from '../types';
import { getSmartInsights } from '../services/geminiService';

interface AIAssistantProps {
  todos: Todo[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ todos }) => {
  const [insights, setInsights] = useState<{ summary: string; suggestions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    if (todos.length === 0) {
      setInsights({ summary: "No tasks yet! Add something to get started.", suggestions: ["Plan your first big goal.", "Break a habit into steps.", "List your main priorities."] });
      return;
    }
    setLoading(true);
    const data = await getSmartInsights(todos);
    setInsights(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-sparkles text-yellow-300"></i>
          AI Productivity Coach
        </h2>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="text-white/80 hover:text-white transition-colors"
        >
          <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-indigo-100 text-sm font-medium mb-1">Status Report</p>
          <p className="text-2xl font-bold">
            {pendingCount === 0 ? "You're all caught up!" : `${pendingCount} tasks remaining`}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          {loading ? (
            <div className="flex flex-col items-center py-4 space-y-2">
              <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
              <div className="h-4 w-48 bg-white/20 rounded animate-pulse"></div>
            </div>
          ) : (
            <p className="italic text-sm leading-relaxed text-indigo-50">
              "{insights?.summary}"
            </p>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">AI Suggestions</p>
          {insights?.suggestions.map((suggestion, idx) => (
            <div key={idx} className="flex items-start gap-3 group">
              <div className="mt-1 h-5 w-5 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                {idx + 1}
              </div>
              <p className="text-sm text-indigo-50 group-hover:text-white transition-colors">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
