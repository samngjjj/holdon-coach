// ============================================================
// HoldOn Coach — Top Navigation Bar (頂部控制列)
// 提供課表切換、個人身型設定、訓練歷史趨勢圖、語音狀態
// ============================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  TrendingUp,
  User,
  Layers,
  ChevronDown,
  Sparkles,
  Zap,
  Utensils,
  Bot,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import PlanSelectorModal from './PlanSelectorModal';
import ProfileModal from './ProfileModal';
import HistoryModal from './HistoryModal';

interface TopNavbarProps {
  onToggleDemoBar?: () => void;
  showDemoBar?: boolean;
}

export default function TopNavbar({ onToggleDemoBar, showDemoBar }: TopNavbarProps) {
  const { session, userProfile, activeTab, setActiveTab, setShowProfileModal, setShowHistoryModal } = useWorkoutStore();
  const [showPlanModal, setShowPlanModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 py-2.5">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('workout')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-xs tracking-tight block">
                教練先別加
              </span>
              <span className="text-[9px] text-orange-400 font-mono tracking-wider block -mt-0.5">
                HOLDON COACH
              </span>
            </div>
          </div>

          {/* Plan Switcher Button */}
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-colors max-w-[140px] sm:max-w-xs"
          >
            <Layers className="w-3 h-3 text-orange-400 shrink-0" />
            <span className="truncate font-medium text-[11px]">{session.plan_name}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500 shrink-0" />
          </button>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* Quick Demo Pill */}
            {onToggleDemoBar && (
              <button
                onClick={onToggleDemoBar}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold border transition-all ${
                  showDemoBar
                    ? 'bg-amber-500/20 border-amber-500/80 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Demo</span>
              </button>
            )}

            {/* Profile Settings */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-colors"
              title="個人身體檔案與生理數據"
            >
              <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold">
                {userProfile.name.slice(0, 1).toUpperCase()}
              </div>
              <span className="font-medium text-xs hidden xs:inline">{userProfile.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <PlanSelectorModal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} />
      <ProfileModal />
      <HistoryModal />
    </>
  );
}
