
import React, { useState } from 'react';
import { Todo, Priority, SubTask } from '../types';
import { breakdownTask } from '../services/geminiService';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleSubTask: (todoId: string, subTaskId: string) => void;
  onAddSubTasks: (todoId: string, subTasks: string[]) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onToggleSubTask, onAddSubTasks }) => {
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBreakdown = async () => {
    if (todo.subTasks.length > 0) {
      setIsExpanded(!isExpanded);
      return;
    }

    setIsBreakingDown(true);
    const steps = await breakdownTask(todo.text);
    if (steps.length > 0) {
      onAddSubTasks(todo.id, steps);
      setIsExpanded(true);
    }
    setIsBreakingDown(false);
  };

  const priorityColors = {
    [Priority.Low]: 'bg-slate-100 text-slate-600',
    [Priority.Medium]: 'bg-blue-100 text-blue-600',
    [Priority.High]: 'bg-rose-100 text-rose-600',
  };

  return (
    <div className={`group bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:shadow-md ${todo.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(todo.id)}
          className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 hover:border-indigo-400'
          }`}
        >
          {todo.completed && <i className="fas fa-check text-xs text-white"></i>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className={`text-slate-800 font-medium transition-all ${todo.completed ? 'line-through text-slate-400' : ''}`}>
            {todo.text}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleBreakdown}
              disabled={isBreakingDown}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 disabled:opacity-50"
            >
              <i className={`fas ${isBreakingDown ? 'fa-spinner fa-spin' : (todo.subTasks.length > 0 ? (isExpanded ? 'fa-chevron-up' : 'fa-list-ul') : 'fa-wand-magic-sparkles')}`}></i>
              {isBreakingDown ? 'Analyzing...' : (todo.subTasks.length > 0 ? (isExpanded ? 'Hide Steps' : `${todo.subTasks.length} Steps`) : 'AI Breakdown')}
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="text-xs font-semibold text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="fas fa-trash-alt mr-1"></i> Delete
            </button>
          </div>
        </div>
      </div>

      {isExpanded && todo.subTasks.length > 0 && (
        <div className="mt-4 ml-10 space-y-2 border-l-2 border-slate-100 pl-4 animate-in slide-in-from-top-2 duration-300">
          {todo.subTasks.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2 group/sub">
              <button
                onClick={() => onToggleSubTask(todo.id, sub.id)}
                className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                  sub.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-400'
                }`}
              >
                {sub.completed && <i className="fas fa-check text-[8px] text-white"></i>}
              </button>
              <span className={`text-sm ${sub.completed ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                {sub.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoItem;
