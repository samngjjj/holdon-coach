// ============================================================
// HoldOn Coach — Clean Bottom Navigation Bar (Mint Green Accent)
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Utensils, TrendingUp, Bot } from 'lucide-react';
import { useWorkoutStore, type AppTab } from '@/stores/workoutStore';

export default function AppBottomNav() {
  const { activeTab, setActiveTab } = useWorkoutStore();

  const tabs: { key: AppTab; label: string; icon: any; badge?: string }[] = [
    { key: 'workout', label: '訓練動作', icon: Dumbbell },
    { key: 'diet', label: '飲食記錄', icon: Utensils },
    { key: 'progress', label: '進度分析', icon: TrendingUp },
    { key: 'chat', label: 'AI 教練', icon: Bot, badge: '專屬' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-3 py-2">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#00A87E] font-black'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-emerald-50 rounded-2xl border border-emerald-200/60"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 mb-0.5 transition-colors ${
                    isActive ? 'text-[#00D09C]' : 'text-slate-400'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-3.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-[#FF6B4A] text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
