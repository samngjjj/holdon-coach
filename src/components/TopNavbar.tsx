// ============================================================
// HoldOn Coach — Top Navigation Bar (30 Days Challenge / Leap Fitness Clean Navy Header)
// ============================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Layers,
  ChevronDown,
  Zap,
  Activity,
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
  const { session, userProfile, activeTab, setActiveTab, setShowProfileModal } = useWorkoutStore();
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Dynamic header title matching the 5 screens in the reference app!
  const getHeaderTitle = () => {
    if (activeTab === 'diet') {
      return (
        <span>
          飲食<span className="text-[#00D09C] ml-0.5">記錄</span>
        </span>
      );
    }
    if (activeTab === 'progress') {
      return (
        <span>
          記錄<span className="text-[#00D09C] ml-1">您的進度</span>
        </span>
      );
    }
    if (activeTab === 'chat') {
      return (
        <span>
          AI隨身<span className="text-[#00D09C] ml-0.5">教練</span>
        </span>
      );
    }
    // Workout tab:
    if (session.current_state === 'ACTIVE_SET' || session.current_state === 'RESTING') {
      return (
        <span>
          訓練<span className="text-[#00D09C] ml-0.5">提示</span>
        </span>
      );
    }
    return (
      <span>
        訓練<span className="text-[#00D09C] ml-0.5">計畫</span>
      </span>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0B132B] text-white px-4 py-3 shadow-md border-b border-[#1E293B]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {/* Main Title matching reference app */}
          <div
            onClick={() => setActiveTab('workout')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <h1 className="text-xl font-black tracking-tight text-white flex items-center">
              {getHeaderTitle()}
            </h1>
            <span className="text-[10px] bg-[#00D09C]/20 text-[#00D09C] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1 hidden xs:inline">
              HoldOn
            </span>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Plan Switcher Chip */}
            <button
              onClick={() => setShowPlanModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16223F] hover:bg-[#1E2D52] border border-[#233560] text-xs text-slate-200 transition-colors shadow-sm"
              title="切換課表分化"
            >
              <Layers className="w-3.5 h-3.5 text-[#00D09C] shrink-0" />
              <span className="truncate font-semibold max-w-[110px] sm:max-w-[150px] text-[11px]">
                {session.plan_name.split('—')[0] || session.plan_name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Quick Demo Pill */}
            {onToggleDemoBar && (
              <button
                onClick={onToggleDemoBar}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  showDemoBar
                    ? 'bg-[#FF6B4A]/20 border-[#FF6B4A] text-[#FF6B4A]'
                    : 'bg-[#16223F] border-[#233560] text-slate-400 hover:text-white'
                }`}
                title="切換快速演練控制列"
              >
                <Zap className="w-3 h-3 text-[#FF6B4A]" />
                <span className="text-[11px] hidden sm:inline">Demo</span>
              </button>
            )}

            {/* User Profile Pill */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-full bg-[#16223F] hover:bg-[#1E2D52] border border-[#233560] text-[#00D09C] flex items-center justify-center font-bold text-xs transition-colors shadow-sm"
              title="個人生理與配重數據"
            >
              {userProfile.name.slice(0, 1).toUpperCase()}
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
