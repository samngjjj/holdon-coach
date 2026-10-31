// ============================================================
// HoldOn Coach — App Bottom Navigation Bar (底部快捷分頁導航)
// 自由切換：訓練卡片流、飲食記錄、進步曲線圖表、AI 隨身教練對話
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Utensils, TrendingUp, MessageSquare, Bot } from 'lucide-react';
import { useWorkoutStore, type AppTab } from '@/stores/workoutStore';

export default function AppBottomNav() {
  const { activeTab, setActiveTab } = useWorkoutStore();

  const tabs: { key: AppTab; label: string; icon: any; badge?: string }[] = [
    { key: 'workout', label: '訓練動作', icon: Dumbbell },
    { key: 'diet', label: '飲食記錄', icon: Utensils },
    { key: 'progress', label: '進步曲線', icon: TrendingUp },
    { key: 'chat', label: 'AI 教練', icon: Bot, badge: '專屬' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-2">
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
                  ? 'text-orange-400 font-bold'
                  : 'text-zinc-500 hover:text-zinc-300 font-medium'
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-orange-500/10 rounded-2xl border border-orange-500/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-orange-400' : 'text-zinc-400'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-3 px-1 py-0.2 rounded-full text-[9px] font-bold bg-orange-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
