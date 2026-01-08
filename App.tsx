
import React, { useState, useEffect } from 'react';
import { Todo, Priority } from './types';
import TodoInput from './components/TodoInput';
import TodoItem from './components/TodoItem';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('zenplan-todos');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('zenplan-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: Priority) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      priority,
      completed: false,
      createdAt: Date.now(),
      subTasks: [],
      category: 'General'
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleSubTask = (todoId: string, subTaskId: string) => {
    setTodos(todos.map(t => {
      if (t.id === todoId) {
        const updatedSubs = t.subTasks.map(s => 
          s.id === subTaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subTasks: updatedSubs };
      }
      return t;
    }));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const completionPercentage = todos.length === 0 ? 0 : Math.round((todos.filter(t => t.completed).length / todos.length) * 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <i className="fas fa-check-double text-lg"></i>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">ZenPlan</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === 'completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Completed
              </button>
            </div>
            <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white">
              <img src="https://picsum.photos/seed/user/32/32" alt="Avatar" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List Column */}
          <div className="lg:col-span-8 space-y-6">
            <TodoInput onAdd={addTodo} />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2">
                  {filter} Tasks ({filteredTodos.length})
                </h3>
              </div>
              
              {filteredTodos.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-clipboard-list text-slate-300 text-2xl"></i>
                  </div>
                  <h3 className="text-slate-500 font-medium">No tasks found here</h3>
                  <p className="text-slate-400 text-sm mt-1">Start by adding a new one above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTodos.map(todo => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onToggleSubTask={toggleSubTask}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 mb-6">
              <h2 className="text-xl font-bold mb-4">Daily Overview</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Total Progress</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{completionPercentage}%</span>
                    <span className="text-indigo-200 text-sm">{todos.filter(t => t.completed).length}/{todos.length} Done</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-1000 ease-out"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200">
              <h4 className="text-slate-800 font-bold mb-4">Task Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Priority
                  </span>
                  <span className="font-bold text-slate-700">{todos.filter(t => t.priority === Priority.High).length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Medium Priority
                  </span>
                  <span className="font-bold text-slate-700">{todos.filter(t => t.priority === Priority.Medium).length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span> Low Priority
                  </span>
                  <span className="font-bold text-slate-700">{todos.filter(t => t.priority === Priority.Low).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 text-center mt-auto">
        <p className="text-slate-400 text-sm">
          ZenPlan Todo &bull; Designed for Focus
        </p>
      </footer>
    </div>
  );
};

export default App;
