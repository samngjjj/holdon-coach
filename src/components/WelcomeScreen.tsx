// ============================================================
// HoldOn Coach — Welcome / Preview Screen
// 支援多訓練計劃概覽、個人身體檔案入口與科學參數
// ============================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dumbbell,
  Flame,
  Shield,
  Mic,
  Layers,
  ChevronRight,
  User,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Edit3,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { calculateProfileStats } from '@/data/exercises';
import PlanSelectorModal from './PlanSelectorModal';
import PlanEditorModal from './PlanEditorModal';

export default function WelcomeScreen() {
  const {
    session,
    userProfile,
    startWorkout,
    setShowProfileModal,
    setShowHistoryModal,
    showPlanEditorModal,
    setShowPlanEditorModal,
    moveExerciseUp,
    moveExerciseDown,
    reverseExercisesOrder,
  } = useWorkoutStore();
  const [showPlanModal, setShowPlanModal] = useState(false);

  const stats = calculateProfileStats(userProfile);

  const features = [
    { icon: Dumbbell, label: '雙重漸進配重', desc: '推滿 12 下才解鎖升重' },
    { icon: Shield, label: '關節安全防護', desc: '痛感或代償即時踩煞車' },
    { icon: Flame, label: '練後營養加碼', desc: '累積訓練量同步碳水蛋白' },
    { icon: Mic, label: '語音即時監聽', desc: '喊聲「痛」或「推完了」即辨識' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      className="min-h-dvh flex flex-col items-center justify-start py-8 px-4 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-25"
          animate={{
            background: [
              'radial-gradient(circle at 30% 40%, rgba(249,115,22,0.18) 0%, transparent 60%)',
              'radial-gradient(circle at 70% 60%, rgba(245,158,11,0.18) 0%, transparent 60%)',
              'radial-gradient(circle at 30% 40%, rgba(249,115,22,0.18) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo & Slogan */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-xl shadow-orange-500/25 mb-3">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            教練先別加
          </h1>
          <p className="text-xs text-orange-400 font-mono tracking-widest uppercase mt-1">
            HOLDON COACH • DYNAMIC LOAD & JOINT GUARD
          </p>
          <p className="text-xs text-zinc-400 mt-2 max-w-xs mx-auto">
            「推滿 12 下再加重，肩膀痛我直接幫你踩煞車」
          </p>
        </motion.div>

        {/* User Profile Mini Bar */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          onClick={() => setShowProfileModal(true)}
          className="bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3 mb-4 flex items-center justify-between cursor-pointer transition-all shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{userProfile.name}</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {userProfile.height_cm}cm / {userProfile.weight_kg}kg
                </span>
                {userProfile.body_fat_pct && (
                  <span className="text-[10px] text-emerald-400 font-mono">
                    BF {userProfile.body_fat_pct}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500">
                建議起始配重：{stats.recommendedPressKg}kg • BMI {stats.bmi}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
        </motion.div>

        {/* Active Plan Card with Switcher */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-5 mb-5 border border-zinc-800/90 text-left shadow-xl"
        >
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-zinc-300">今日訓練課表</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowPlanEditorModal(true)}
                className="text-xs text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-full border border-orange-500/25 transition-colors"
                title="編輯課表或調整順序"
              >
                <Edit3 className="w-3 h-3" />
                <span>編輯/調序</span>
              </button>
              <button
                onClick={() => setShowPlanModal(true)}
                className="text-xs text-zinc-400 hover:text-white font-semibold flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-full border border-zinc-700 transition-colors"
              >
                <span>切換分化</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-white">
              {session.plan_name}
            </h3>
            <button
              onClick={reverseExercisesOrder}
              className="text-[11px] text-zinc-400 hover:text-orange-400 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-800/60 border border-zinc-750 transition-colors"
              title="將動作次序前後完全調轉"
            >
              <RotateCcw className="w-3 h-3 text-orange-400" />
              <span>次序前後調轉</span>
            </button>
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            肌肥大安全目標：8–12 Reps • 滿 12 下連續兩組解鎖升重
          </p>

          {/* Exercise List */}
          <div className="space-y-2.5">
            {session.exercises.map((ex, i) => (
              <div
                key={ex.exercise_id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-800/60 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-400 flex items-center justify-center text-xs font-mono shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {ex.exercise_name}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {ex.grip_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-orange-400 font-mono">
                      {ex.target_load.weight_kg}kg
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      {ex.total_sets}組 × {ex.target_load.reps}下
                    </span>
                  </div>

                  {/* Up / Down reorder arrows */}
                  <div className="flex items-center gap-1 pl-1 border-l border-zinc-800">
                    <button
                      onClick={() => moveExerciseUp(i)}
                      disabled={i === 0}
                      title="上移動作"
                      className="w-6 h-6 rounded bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-20 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveExerciseDown(i)}
                      disabled={i === session.exercises.length - 1}
                      title="下移動作"
                      className="w-6 h-6 rounded bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-20 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-2 gap-2 mb-6"
        >
          {features.map((f) => (
            <div
              key={f.label}
              className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800/70 text-left"
            >
              <f.icon className="w-4 h-4 text-orange-400 mb-1" />
              <p className="text-xs font-bold text-zinc-200">{f.label}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Start Button */}
        <motion.button
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startWorkout}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white font-extrabold text-lg shadow-xl shadow-orange-500/25 active:opacity-90 transition-all"
        >
          開始今日訓練 🔥
        </motion.button>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-zinc-500">
          <button
            onClick={() => setShowHistoryModal(true)}
            className="hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>查看歷史趨勢圖</span>
          </button>
          <span>•</span>
          <button
            onClick={() => setShowProfileModal(true)}
            className="hover:text-zinc-300 flex items-center gap-1 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-orange-400" />
            <span>身體生理指標</span>
          </button>
        </div>
      </div>

      <PlanSelectorModal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} />
      <PlanEditorModal isOpen={showPlanEditorModal} onClose={() => setShowPlanEditorModal(false)} />
    </motion.div>
  );
}
