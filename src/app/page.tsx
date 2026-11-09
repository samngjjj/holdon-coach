// ============================================================
// HoldOn Coach — Main Workout Page (主畫面)
// 支援四大分頁：訓練動作卡片流、飲食記錄、真實進步曲線、專屬 AI 隨身教練對話
// ============================================================

'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '@/stores/workoutStore';
import TopNavbar from '@/components/TopNavbar';
import FastDemoBar from '@/components/FastDemoBar';
import WelcomeScreen from '@/components/WelcomeScreen';
import ExerciseCard from '@/components/ExerciseCard';
import RestTimerOverlay from '@/components/RestTimerOverlay';
import WorkoutSummary from '@/components/WorkoutSummary';
import ExerciseTransition from '@/components/ExerciseTransition';
import HardLimitWarning from '@/components/HardLimitWarning';
import DietTrackerView from '@/components/DietTrackerView';
import ProgressAnalyticsView from '@/components/ProgressAnalyticsView';
import AICoachChatView from '@/components/AICoachChatView';
import PlanSelectionView from '@/components/PlanSelectionView';
import AppBottomNav from '@/components/AppBottomNav';

export default function Home() {
  const {
    session,
    isResting,
    showSummary,
    showHardLimitWarning,
    activeTab,
  } = useWorkoutStore();

  const [showDemoBar, setShowDemoBar] = useState(false);

  const isWorkoutCompleted = showSummary || session.current_state === 'COMPLETED';

  return (
    <main className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col selection:bg-[#00D09C]/30 pb-16">
      {/* Top Navbar */}
      <TopNavbar
        onToggleDemoBar={() => setShowDemoBar((prev) => !prev)}
        showDemoBar={showDemoBar}
      />

      {/* Fast Demo Bar */}
      <AnimatePresence>
        {showDemoBar && (
          <FastDemoBar onClose={() => setShowDemoBar(false)} />
        )}
      </AnimatePresence>

      {/* Main Tab Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'plans' ? (
          <PlanSelectionView key="tab-plans" />
        ) : activeTab === 'diet' ? (
          <DietTrackerView key="tab-diet" />
        ) : activeTab === 'progress' ? (
          <ProgressAnalyticsView key="tab-progress" />
        ) : activeTab === 'chat' ? (
          <AICoachChatView key="tab-chat" />
        ) : (
          /* Workout Tab */
          isWorkoutCompleted ? (
            <WorkoutSummary key="summary-view" />
          ) : session.current_state === 'PREVIEW' ? (
            <WelcomeScreen key="welcome-view" />
          ) : (
            <ExerciseTransition key="exercise-view">
              <ExerciseCard />
            </ExerciseTransition>
          )
        )}
      </div>

      {/* Rest Timer Overlay (Full Screen) — Active during workout resting */}
      <AnimatePresence>
        {isResting && !isWorkoutCompleted && activeTab === 'workout' && (
          <RestTimerOverlay key="rest-timer-overlay" />
        )}
      </AnimatePresence>

      {/* Hard Limit Safety Warning Modal */}
      <AnimatePresence>
        {showHardLimitWarning && <HardLimitWarning key="hard-limit-warning" />}
      </AnimatePresence>

      {/* Bottom Tab Navigation Bar */}
      <AppBottomNav />
    </main>
  );
}
