import React, { useState, useEffect, useCallback } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';

// ── Icons (inline SVG to avoid extra deps) ──────────────
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

// ── Todo Card ────────────────────────────────────────────
function TodoCard({ todo, onToggle, onDelete, onEdit }) {
  return (
    <div className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 animate-slide-in
      ${todo.completed
        ? 'bg-white/40 border-ink/10'
        : 'bg-white border-ink/10 shadow-sm hover:shadow-md hover:-translate-y-0.5'
      }`}>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo)}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
          ${todo.completed
            ? 'bg-sage border-sage text-white'
            : 'border-ink/25 hover:border-accent hover:bg-accent/10'
          }`}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && <CheckIcon />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium leading-snug transition-all duration-200
          ${todo.completed ? 'line-through text-ink/35' : 'text-ink'}`}>
          {todo.title}
        </p>
        {todo.description && (
          <p className={`mt-0.5 text-sm leading-relaxed transition-all duration-200
            ${todo.completed ? 'text-ink/25' : 'text-ink/55'}`}>
            {todo.description}
          </p>
        )}
        <p className="mt-1.5 text-xs font-mono text-ink/30">
          {new Date(todo.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 rounded-lg text-ink/40 hover:text-accent hover:bg-accent/10 transition-colors duration-150"
          aria-label="Edit todo"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded-lg text-ink/40 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
          aria-label="Delete todo"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

// ── Edit Modal ───────────────────────────────────────────
function EditModal({ todo, onSave, onClose }) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(todo.id, { title: title.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-cream rounded-3xl p-6 shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink/40 hover:text-ink hover:bg-ink/10 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium font-mono text-ink/50 mb-1.5 uppercase tracking-wider">Title</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-white text-ink placeholder-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              placeholder="Task title"
            />
          </div>
          <div>
            <label className="block text-xs font-medium font-mono text-ink/50 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-ink/15 bg-white text-ink placeholder-ink/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all resize-none"
              placeholder="Optional description..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-ink/15 text-ink/60 font-medium hover:bg-ink/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl bg-accent text-white font-medium hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [showDescInput, setShowDescInput] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all'); // all | active | completed

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);
      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const todo = await createTodo(newTitle.trim(), newDesc.trim());
      setTodos(prev => [todo, ...prev]);
      setNewTitle('');
      setNewDesc('');
      setShowDescInput(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id, updates) => {
    try {
      const updated = await updateTodo(id, updates);
      setTodos(prev => prev.map(t => t.id === updated.id ? updated : t));
      setEditingTodo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-cream px-4 py-12">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-mono text-accent uppercase tracking-widest mb-1">DSO101 — Assignment I</p>
          <h1 className="text-4xl font-bold text-ink tracking-tight">My Tasks</h1>
          {todos.length > 0 && (
            <p className="mt-2 text-sm text-ink/45 font-mono">
              {activeCount} remaining · {completedCount} done
            </p>
          )}
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-2xl border border-ink/10 shadow-sm p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Add a new task…"
              className="flex-1 bg-transparent text-ink placeholder-ink/30 text-sm font-medium focus:outline-none"
            />
            <button
              onClick={handleCreate}
              disabled={!newTitle.trim()}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-light disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 hover:scale-105 active:scale-95"
              aria-label="Add task"
            >
              <PlusIcon />
            </button>
          </div>

          {/* Optional description toggle */}
          {newTitle.trim() && (
            <div className="mt-3 pt-3 border-t border-ink/8 animate-fade-in">
              {showDescInput ? (
                <div className="flex gap-2 items-start">
                  <textarea
                    autoFocus
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Add a description (optional)…"
                    rows={2}
                    className="flex-1 text-sm text-ink/70 placeholder-ink/25 bg-transparent focus:outline-none resize-none"
                  />
                  <button onClick={() => { setShowDescInput(false); setNewDesc(''); }} className="text-ink/30 hover:text-ink/60 transition-colors mt-0.5">
                    <CloseIcon />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDescInput(true)}
                  className="text-xs font-mono text-ink/35 hover:text-accent transition-colors"
                >
                  + Add description
                </button>
              )}
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        {todos.length > 0 && (
          <div className="flex gap-1 mb-4 p-1 bg-ink/8 rounded-xl w-fit">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium font-mono capitalize transition-all duration-150
                  ${filter === f ? 'bg-white text-ink shadow-sm' : 'text-ink/45 hover:text-ink/70'}`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center justify-between animate-fade-in">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><CloseIcon /></button>
          </div>
        )}

        {/* Todo List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-ink/8 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-4xl mb-3">
              {filter === 'completed' ? '🎉' : filter === 'active' ? '✅' : '📝'}
            </p>
            <p className="text-ink/40 font-mono text-sm">
              {filter === 'completed' ? 'Nothing completed yet' :
               filter === 'active' ? 'All tasks done!' :
               'No tasks yet. Add one above!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={setEditingTodo}
              />
            ))}
          </div>
        )}

        {/* Clear completed */}
        {completedCount > 0 && filter !== 'active' && (
          <div className="mt-6 text-center animate-fade-in">
            <button
              onClick={async () => {
                const completed = todos.filter(t => t.completed);
                await Promise.all(completed.map(t => deleteTodo(t.id)));
                setTodos(prev => prev.filter(t => !t.completed));
              }}
              className="text-xs font-mono text-ink/30 hover:text-red-400 transition-colors"
            >
              Clear {completedCount} completed {completedCount === 1 ? 'task' : 'tasks'}
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTodo && (
        <EditModal
          todo={editingTodo}
          onSave={handleEdit}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}