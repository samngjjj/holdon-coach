// ============================================================
// HoldOn Coach — Plan Selection View (訓練計畫選擇頁面)
// 1:1 完美還原參考圖 Screen 1「訓練計畫」：
// 深藍頂部導航、純白圓角大卡片：【腹部減脂】、【六塊腹肌】、【臀部】
// 加上推拉腿 (PPL)、二分化 (Upper/Lower)、五分化 (Bro Split) 全面分化
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Zap,
  Check,
  ChevronRight,
  ShieldCheck,
  Dumbbell,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Layers,
  X,
  Play,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { WORKOUT_PLANS, type WorkoutPlanPreset } from '@/data/exercises';
import ExerciseIllustration from './ExerciseIllustration';

export default function PlanSelectionView() {
  const { session, selectPlan, setActiveTab } = useWorkoutStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewPlan, setPreviewPlan] = useState<WorkoutPlanPreset | null>(null);

  const heroPlans = WORKOUT_PLANS.filter((p) => p.category === 'SpecialFocus');
  const otherPlans = WORKOUT_PLANS.filter((p) => p.category !== 'SpecialFocus');

  const filteredPlans =
    selectedCategory === 'all'
      ? WORKOUT_PLANS
      : selectedCategory === 'special'
      ? heroPlans
      : WORKOUT_PLANS.filter((p) => p.category === selectedCategory);

  const handleChoosePlan = (plan: WorkoutPlanPreset) => {
    selectPlan(plan.id);
    setPreviewPlan(null);
    setActiveTab('workout');
  };

  return (
    <div className="w-full min-h-screen bg-[#F1F5F9] pb-24 text-slate-900">
      {/* Hero Top Title Banner matching Screen 1 in reference */}
      <div className="bg-[#0B132B] pt-6 pb-8 px-4 text-center text-white border-b border-[#1E293B]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D09C]/15 border border-[#00D09C]/30 text-[#00D09C] text-xs font-black mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            30 天漸進式蛻變課表庫
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            訓練<span className="text-[#00D09C] ml-1">計畫</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            選擇您的專屬雕塑目標，系統恪守「雙重漸進」與「關節防護」
          </p>
        </motion.div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 space-y-5">
        {/* ============================================================ */}
        {/* 1. 三大焦點專項卡片 (1:1 還原用戶上傳之 Screen 1「訓練計畫」) */}
        {/* ============================================================ */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md overflow-hidden divide-y divide-slate-100">
          {/* Card 1: 腹部減脂 */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const plan = WORKOUT_PLANS.find((p) => p.id === 'fat_loss_belly') || heroPlans[0];
              setPreviewPlan(plan);
            }}
            className="group relative flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex-1 pr-3 z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200">
                  🔥 燃脂 280 kcal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  無需器材
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-[#00A87E] transition-colors">
                腹部減脂
              </h2>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                消除腰腹贅肉 • 喚醒深層腹橫肌
              </p>
              <div className="mt-2.5 flex items-center gap-1 text-xs font-extrabold text-[#00A87E]">
                <span>查看 30 日課表</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Visual Graphic Right Side (Waist Silhouette) */}
            <div className="w-28 sm:w-32 h-28 shrink-0 relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 via-sky-50 to-emerald-50 overflow-hidden border border-slate-100">
              <svg viewBox="0 0 120 120" className="w-full h-full p-1" fill="none">
                {/* Background soft glow */}
                <circle cx="60" cy="60" r="50" fill="#F8FAFC" />
                {/* Comparison silhouette */}
                {/* Before: curve wider */}
                <path
                  d="M 28 30 C 22 55, 18 75, 26 95 L 42 95 C 44 75, 42 55, 38 30 Z"
                  fill="#E2E8F0"
                  opacity="0.8"
                />
                {/* After: slim athletic waist curve */}
                <path
                  d="M 68 25 C 80 45, 66 60, 84 95 L 102 95 C 104 65, 96 45, 88 25 Z"
                  fill="#FDA4AF"
                />
                {/* Athletic waistline highlight */}
                <path
                  d="M 74 38 C 70 52, 70 65, 78 78"
                  stroke="#F43F5E"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Measuring Tape / Arrow */}
                <path
                  d="M 50 58 Q 72 65 95 56"
                  stroke="#00D09C"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <circle cx="95" cy="56" r="3" fill="#00D09C" />
              </svg>
              {session.plan_id === 'fat_loss_belly' && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#00D09C] text-white shadow-xs">
                  進行中
                </span>
              )}
            </div>
          </motion.div>

          {/* Card 2: 六塊腹肌 */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const plan = WORKOUT_PLANS.find((p) => p.id === 'six_pack_abs') || heroPlans[1];
              setPreviewPlan(plan);
            }}
            className="group relative flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex-1 pr-3 z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200">
                  ⚡ 核心撕裂
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  30 日漸進
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-[#00A87E] transition-colors">
                六塊腹肌
              </h2>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                雕塑深邃六塊腹肌 • 強化側腹稜角
              </p>
              <div className="mt-2.5 flex items-center gap-1 text-xs font-extrabold text-[#00A87E]">
                <span>查看 30 日課表</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Visual Graphic Right Side (Six Pack Muscular Torso) */}
            <div className="w-28 sm:w-32 h-28 shrink-0 relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 via-slate-50 to-orange-50 overflow-hidden border border-slate-100">
              <svg viewBox="0 0 120 120" className="w-full h-full p-1" fill="none">
                {/* Torso outline */}
                <path
                  d="M 30 20 L 90 20 L 82 105 L 38 105 Z"
                  fill="#E2E8F0"
                  opacity="0.5"
                />
                {/* Chest contours */}
                <path
                  d="M 35 32 Q 60 40 85 32"
                  stroke="#94A3B8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <line x1="60" y1="36" x2="60" y2="100" stroke="#94A3B8" strokeWidth="2.5" />
                {/* 6 Pack Blocks */}
                <rect x="42" y="44" width="14" height="12" rx="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
                <rect x="64" y="44" width="14" height="12" rx="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />

                <rect x="43" y="60" width="13" height="13" rx="3" fill="#F59E0B" opacity="0.8" />
                <rect x="64" y="60" width="13" height="13" rx="3" fill="#F59E0B" opacity="0.8" />

                <rect x="44" y="77" width="12" height="12" rx="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
                <rect x="64" y="77" width="12" height="12" rx="3" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
                {/* Oblique cuts */}
                <path d="M 36 68 Q 42 75 42 85" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 84 68 Q 78 75 78 85" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              {session.plan_id === 'six_pack_abs' && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#00D09C] text-white shadow-xs">
                  進行中
                </span>
              )}
            </div>
          </motion.div>

          {/* Card 3: 臀部 */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const plan = WORKOUT_PLANS.find((p) => p.id === 'glutes_focus') || heroPlans[2];
              setPreviewPlan(plan);
            }}
            className="group relative flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex-1 pr-3 z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-50 text-purple-600 border border-purple-200">
                  🍑 翹臀塑形
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  低關節壓力
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 group-hover:text-[#00A87E] transition-colors">
                臀部
              </h2>
              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                飽滿蜜桃臀微笑線 • 提臀不粗腿
              </p>
              <div className="mt-2.5 flex items-center gap-1 text-xs font-extrabold text-[#00A87E]">
                <span>查看 30 日課表</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Visual Graphic Right Side (Glutes & Leggings Curve) */}
            <div className="w-28 sm:w-32 h-28 shrink-0 relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-sky-50 overflow-hidden border border-slate-100">
              <svg viewBox="0 0 120 120" className="w-full h-full p-1" fill="none">
                {/* Athletic waist & glutes curve in leggings */}
                <path
                  d="M 45 22 Q 40 40 48 55 Q 60 75 52 110 L 68 110 Q 72 80 84 65 Q 92 48 80 22 Z"
                  fill="#E9D5FF"
                />
                {/* Leggings waistband */}
                <path
                  d="M 45 28 Q 62 34 80 28"
                  stroke="#9333EA"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Glute muscle peak curve highlight */}
                <path
                  d="M 52 54 Q 75 70 82 58"
                  stroke="#A855F7"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Motion upward lift arrow */}
                <path
                  d="M 72 90 Q 82 78 80 68"
                  stroke="#00D09C"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="3 3"
                />
                <polygon points="76,64 85,67 80,74" fill="#00D09C" />
              </svg>
              {session.plan_id === 'glutes_focus' && (
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#00D09C] text-white shadow-xs">
                  進行中
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* 2. 更多訓練分化課表 (推拉腿 PPL、二分化、五分化) */}
        {/* ============================================================ */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-[#00D09C]" />
              重訓室分化課表 (雙重漸進)
            </h3>
            <span className="text-xs text-slate-400 font-bold">
              共 {WORKOUT_PLANS.length} 套計畫
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: '全部' },
              { id: 'SpecialFocus', label: '🔥 30日專項' },
              { id: 'PPL', label: '推拉腿 (PPL)' },
              { id: 'UpperLower', label: '二分化' },
              { id: 'BroSplit', label: '五分化' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#0B132B] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Plan Cards Grid */}
          <div className="space-y-3 mt-2">
            {filteredPlans.map((plan) => {
              const isCurrent = session.plan_id === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPreviewPlan(plan)}
                  className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                    isCurrent
                      ? 'border-[#00D09C] ring-2 ring-[#00D09C]/20'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {plan.categoryLabel}
                        </span>
                        {plan.equipment && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            {plan.equipment}
                          </span>
                        )}
                        {plan.duration && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {plan.duration}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-black text-slate-900">
                        {plan.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                        <span className="font-bold text-slate-700">
                          🎯 {plan.targetFocus}
                        </span>
                        <span>•</span>
                        <span>{plan.exercises.length} 個訓練動作</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end justify-between self-stretch">
                      {isCurrent ? (
                        <span className="px-2 py-1 rounded-full text-[10px] font-black bg-[#00D09C] text-white flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3" />
                          使用中
                        </span>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#00D09C]/20 group-hover:text-[#00A87E] transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. 課表詳情與一鍵套用彈窗 (Preview Drawer / Modal) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {previewPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
            onClick={() => setPreviewPlan(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C]/15 text-[#00A87E]">
                      {previewPlan.categoryLabel}
                    </span>
                    {session.plan_id === previewPlan.id && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C] text-white">
                        目前進行中
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-1">
                    {previewPlan.name}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewPlan(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: Scrollable exercise list */}
              <div className="p-5 overflow-y-auto space-y-4">
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800 mb-1">📋 課表介紹</p>
                  <p>{previewPlan.description}</p>
                  <p className="mt-2 text-slate-500 font-medium">
                    🎯 焦點肌群：<span className="text-slate-800 font-bold">{previewPlan.targetFocus}</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                    包含動作模組 ({previewPlan.exercises.length})
                  </h4>
                  <div className="space-y-2.5">
                    {previewPlan.exercises.map((ex, idx) => (
                      <div
                        key={ex.exercise_id + idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                            <ExerciseIllustration
                              exerciseId={ex.exercise_id}
                              exerciseName={ex.exercise_name}
                              className="w-full h-full scale-90"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {idx + 1}. {ex.exercise_name}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {ex.total_sets} 組 × {ex.target_load.reps} 下 • {ex.grip_type}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-black font-mono text-[#00A87E] bg-emerald-50 px-2.5 py-1 rounded-xl">
                          {ex.target_load.weight_kg > 0 ? `${ex.target_load.weight_kg}kg` : '自重'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer CTA */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <button
                  onClick={() => handleChoosePlan(previewPlan)}
                  className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  採用此計畫並開啟 30 日課表
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
