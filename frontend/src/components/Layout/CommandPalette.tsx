import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, LayoutDashboard, Package, ShoppingCart, Users, Warehouse, BarChart3, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type Suggestion = { label: string; path: string; icon: React.ComponentType<{className?: string}> };

const ALL_SUGGESTIONS: Suggestion[] = [
  { label: 'Go to Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Open Products', path: '/products', icon: Package },
  { label: 'View Sales', path: '/sales', icon: ShoppingCart },
  { label: 'Open Customers', path: '/customers', icon: Users },
  { label: 'Open Inventory', path: '/inventory', icon: Warehouse },
  { label: 'Open Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Generate AI Report', path: '/reports', icon: Brain },
];

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, setOpen }) => {
  const onClose = () => setOpen(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_SUGGESTIONS;
    return ALL_SUGGESTIONS.filter(s => s.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => { setActive(0); }, [query, open]);

  const go = (s: Suggestion) => {
    navigate(s.path);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto max-w-2xl mt-24 px-4">
        <div className="rounded-xl border border-neutral-200/70 dark:border-neutral-700/60 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 p-3 border-b border-neutral-200/70 dark:border-neutral-700/60">
            <Search className="h-5 w-5 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, suggestions.length - 1)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
                if (e.key === 'Enter' && suggestions[active]) { go(suggestions[active]); }
              }}
              className="w-full bg-transparent outline-none text-neutral-800 dark:text-neutral-100 placeholder-neutral-400"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs">ESC</kbd>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">Suggestions</div>
            <ul className="p-1">
              {suggestions.length === 0 && (
                <li className="px-3 py-4 text-sm text-neutral-500">No results</li>
              )}
              {suggestions.map((s, idx) => {
                const Icon = s.icon;
                const isActive = idx === active;
                return (
                  <li key={s.label}>
                    <button
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => go(s)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${isActive ? 'bg-neutral-100 dark:bg-neutral-800' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                    >
                      <Icon className="h-4 w-4 text-neutral-500" />
                      <span>{s.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
