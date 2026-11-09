// ============================================================
// HoldOn Coach — Welcome / 30-Day Plan Screen (模仿 30 Days Challenge / Leap Fitness)
// 呈現 Screen 1「訓練計畫」與 Screen 2「30日計畫」日程清單與 Screen 4「動作清單」
// ============================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Edit3,
  Coffee,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Activity,
  Play,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { calculateProfileStats, WORKOUT_PLANS } from '@/data/exercises';
import PlanSelectorModal from './PlanSelectorModal';
import PlanEditorModal from './PlanEditorModal';
import ExerciseIllustration from './ExerciseIllustration';

export default function WelcomeScreen() {
  const {
    session,
    userProfile,
    startWorkout,
    selectPlan,
    setActiveTab,
    setShowProfileModal,
    setShowHistoryModal,
    showPlanEditorModal,
    setShowPlanEditorModal,
    moveExerciseUp,
    moveExerciseDown,
    reverseExercisesOrder,
  } = useWorkoutStore();

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(4); // Default to Day 4 (like screenshot)

  const stats = calculateProfileStats(userProfile);

  // 30-Day Plan items modeled directly after Screen 2 in the user's photo!
  const daysList = [
    { day: 1, label: '第 1 天', status: 'completed', focus: '上斜臥推與胸肌基底' },
    { day: 2, label: '第 2 天', status: 'completed', focus: '肩部與三頭線條' },
    { day: 3, label: '第 3 天', status: 'completed', focus: '多角度發力掌握' },
    { day: 4, label: '第 4 天', status: 'active', focus: `${session.plan_name} • 突破 12 下` },
    { day: 5, label: '休息日', status: 'rest', focus: '超量恢復與肌纖維重構' },
    { day: 6, label: '第 6 天', status: 'upcoming', focus: '中立握法抗阻推進' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-24 text-slate-800">
      {/* 1. Top 30-Day Plan Hero Card (Screen 2: 30日計畫 with Orange Tag) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 mb-5 relative"
      >
        {/* Banner with Orange Badge & Home Workout Photo (Screen 2: 30日計畫 Exact Match) */}
        <div className="relative h-44 sm:h-48 flex items-center justify-between px-6 overflow-hidden">
          {/* Background Real Workout Photo */}
          <img
            src="/images/plans/home_workout_couple.jpg"
            alt="30日計畫在家進行"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Dark Contrast Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/95 via-[#0B132B]/85 to-transparent" />
          
          {/* Top Left Orange Tag: '在家進行' (Screen 2 1:1 還原) */}
          <div className="absolute top-0 left-0 bg-[#FF6B4A] text-white text-xs font-black px-4 py-1.5 rounded-br-2xl shadow-lg flex items-center gap-1 z-10 tracking-wide">
            <span>在家進行</span>
          </div>

          <div className="relative z-10 pt-4 text-left max-w-[70%]">
            <span className="text-[#00D09C] text-xs font-extrabold uppercase tracking-wider block mb-1">
              30日挑戰 • 第 4 天
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight drop-shadow-sm">
              {session.plan_name.split('—')[0]}
            </h2>
            <p className="text-xs text-slate-200 mt-1 flex items-center gap-1">
              <span>🎯 推滿 12 下自動升重 • 肩膀痛即刻煞車</span>
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => setActiveTab('plans')}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 transition-all flex items-center gap-1 shadow-xs"
              >
                <span>更換計畫</span>
                <ChevronRight className="w-3 h-3 text-[#00D09C]" />
              </button>
            </div>
          </div>

          {/* Quick Start Circle Floating Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startWorkout}
            className="w-14 h-14 rounded-full bg-[#00D09C] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 z-10"
            title="立即開練"
          >
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </motion.button>
        </div>

        {/* 30-Day Schedule Progression (Screen 2 checklist) */}
        <div className="p-4 space-y-2.5 bg-white">
          <div className="flex items-center justify-between pb-1 text-xs text-slate-400 font-semibold px-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00D09C]" />
              <span>本週訓練進度</span>
            </span>
            <span className="text-[11px] text-slate-500">已完成 3 / 30 天</span>
          </div>

          {daysList.map((item) => {
            if (item.status === 'completed') {
              return (
                <div
                  key={item.day}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <span className="text-xs text-slate-400 hidden xs:inline">{item.focus}</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#00D09C] flex items-center justify-center font-bold">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
              );
            }

            if (item.status === 'active') {
              return (
                <motion.div
                  key={item.day}
                  whileHover={{ scale: 1.01 }}
                  onClick={startWorkout}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#00D09C] text-white shadow-md shadow-emerald-500/25 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold tracking-tight">{item.label} (今日)</span>
                    <span className="text-xs text-white/90 font-medium">
                      {session.exercises.length} 個動作 • 建議 {session.exercises[0]?.target_load.weight_kg}kg
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full border-2 border-white/80 flex items-center justify-center text-[11px] font-bold">
                      0%
                    </span>
                  </div>
                </motion.div>
              );
            }

            if (item.status === 'rest') {
              return (
                <div
                  key={item.day}
                  className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-amber-900"
                >
                  <div className="flex items-center gap-2.5">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-800">{item.label}</span>
                    <span className="text-xs text-amber-600/80">{item.focus}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    休息日
                  </span>
                </div>
              );
            }

            return (
              <div
                key={item.day}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 border border-slate-100 text-slate-400"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-slate-400">{item.focus}</span>
                </div>
                <div className="w-6 h-6 rounded-full border border-slate-200" />
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 2. Screen 4 Style: 「今日動作清單 / 無需器材」 (Clean Minimalist Cards with Motion Arrows) */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#00D09C]/15 text-[#00A87E] flex items-center gap-1">
              <span>無需器械 / 啞鈴推薦</span>
            </span>
            <span className="text-sm font-black text-slate-800">今日動作清單</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={reverseExercisesOrder}
              className="text-xs font-semibold text-slate-600 hover:text-[#00D09C] bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1 transition-colors"
              title="前後次序調轉"
            >
              <RotateCcw className="w-3 h-3 text-[#00D09C]" />
              <span>調轉順序</span>
            </button>
            <button
              onClick={() => setShowPlanEditorModal(true)}
              className="text-xs font-semibold text-white bg-[#0B132B] hover:bg-[#16223F] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3 text-[#00D09C]" />
              <span>編輯課表</span>
            </button>
          </div>
        </div>

        {/* Stacked Clean Exercise Cards (Screen 4 Style) */}
        <div className="space-y-2.5">
          {session.exercises.map((ex, i) => (
            <motion.div
              key={`${ex.exercise_id}_${i}`}
              layout
              className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3"
            >
              {/* Left Info */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 font-mono">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {ex.exercise_name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {ex.total_sets} 組 × {ex.target_load.reps} 次 • 目標 <span className="text-[#00D09C] font-bold">{ex.target_load.weight_kg}kg</span>
                  </p>
                </div>
              </div>

              {/* Right: Motion Trajectory Thumbnail + Reorder Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1">
                  <ExerciseIllustration
                    exerciseId={ex.exercise_id}
                    exerciseName={ex.exercise_name}
                    className="w-full h-full scale-125"
                  />
                </div>

                {/* Arrow up/down */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveExerciseUp(i)}
                    disabled={i === 0}
                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-600 flex items-center justify-center text-[10px]"
                    title="上移"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveExerciseDown(i)}
                    disabled={i === session.exercises.length - 1}
                    className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-20 text-slate-600 flex items-center justify-center text-[10px]"
                    title="下移"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Screen 1 Style: 「訓練計畫」分化推薦卡片 (腹部減脂 / 六塊腹肌 / 臀部) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-sm font-black text-slate-800">推薦訓練計畫</span>
          <button
            onClick={() => setActiveTab('plans')}
            className="text-xs text-[#00A87E] font-bold hover:underline flex items-center gap-0.5"
          >
            <span>全部計畫 ({WORKOUT_PLANS.length})</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {WORKOUT_PLANS.slice(0, 4).map((plan) => {
            const isSelected = plan.id === session.plan_id;
            return (
              <div
                key={plan.id}
                onClick={() => selectPlan(plan.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-50/80 border-[#00D09C] ring-2 ring-[#00D09C]/30 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00D09C]" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {plan.categoryLabel}
                </span>
                <h4 className="text-xs font-bold text-slate-800 truncate mb-1">
                  {plan.name.split('—')[0]}
                </h4>
                <p className="text-[10px] text-slate-500 line-clamp-1">
                  {plan.targetFocus}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Main Action Button */}
      <div className="sticky bottom-20 z-20 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startWorkout}
          className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B887] text-white font-black text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>開始今日訓練 (第 4 天)</span>
        </motion.button>
      </div>

      {/* Modals */}
      <PlanSelectorModal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} />
      <PlanEditorModal isOpen={showPlanEditorModal} onClose={() => setShowPlanEditorModal(false)} />
    </div>
  );
}
