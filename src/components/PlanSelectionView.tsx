// ============================================================
// HoldOn Coach — Plan Selection View (訓練計畫選擇頁面)
// 根據 Jeff Nippard 運動科學與肌肥大指南全面重構：
// 涵蓋長肌纖維拉伸 (Stretch-Mediated Hypertrophy)、最佳肌電圖角度、雙重漸進與關節保護
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
  Award,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { WORKOUT_PLANS, type WorkoutPlanPreset } from '@/data/exercises';
import ExerciseIllustration from './ExerciseIllustration';

export default function PlanSelectionView() {
  const { session, selectPlan, setActiveTab } = useWorkoutStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewPlan, setPreviewPlan] = useState<WorkoutPlanPreset | null>(null);

  const heroPlans = WORKOUT_PLANS.filter((p) => p.category === 'SpecialFocus');

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
    <div className="w-full min-h-screen bg-[#0B132B] pb-24 text-white">
      {/* ============================================================ */}
      {/* 1. Header (1:1 還原用戶上傳之 Screen 1「訓練計畫」標題) */}
      {/* ============================================================ */}
      <div className="pt-8 pb-6 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wider inline-flex items-center justify-center gap-1">
            <span>訓練</span>
            <span className="text-[#00D09C] relative inline-block">
              計畫
              <span className="absolute -bottom-1.5 left-0 right-0 h-[3.5px] bg-[#00D09C] rounded-full" />
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Jeff Nippard 科學肌肥大 • 長肌纖維拉伸 • 雙重漸進 (RIR 1-2)
          </p>
        </motion.div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-6">
        {/* ============================================================ */}
        {/* 2. 三大焦點專項白色卡片 (1:1 精確還原用戶截圖之白色圓角大卡片) */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-2xl border border-white/10 divide-y divide-slate-100"
        >
          {/* Row 1: 腹部減脂 */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const plan = WORKOUT_PLANS.find((p) => p.id === 'fat_loss_belly') || heroPlans[0];
              setPreviewPlan(plan);
            }}
            className="group relative flex items-center justify-between min-h-[130px] sm:min-h-[145px] pl-6 sm:pl-8 cursor-pointer hover:bg-slate-50/90 transition-colors overflow-hidden"
          >
            <div className="flex-1 pr-3 z-10 py-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#00A87E] transition-colors">
                腹部減脂
              </h2>
              <div className="mt-2 flex items-center gap-2">
                {session.plan_id === 'fat_loss_belly' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C] text-white shadow-xs">
                    進行中
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#00A87E] transition-colors flex items-center gap-0.5">
                    查看課表 <ChevronRight className="w-3.5 h-3.5 inline" />
                  </span>
                )}
              </div>
            </div>

            <div className="w-36 sm:w-44 h-32 sm:h-36 shrink-0 relative overflow-hidden flex items-center justify-end">
              <img
                src="/images/plans/belly_fat_loss.jpg"
                alt="腹部減脂"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Row 2: 六塊腹肌 */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const plan = WORKOUT_PLANS.find((p) => p.id === 'six_pack_abs') || heroPlans[1];
              setPreviewPlan(plan);
            }}
            className="group relative flex items-center justify-between min-h-[130px] sm:min-h-[145px] pl-6 sm:pl-8 cursor-pointer hover:bg-slate-50/90 transition-colors overflow-hidden"
          >
            <div className="flex-1 pr-3 z-10 py-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#00A87E] transition-colors">
                六塊腹肌
              </h2>
              <div className="mt-2 flex items-center gap-2">
                {session.plan_id === 'six_pack_abs' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C] text-white shadow-xs">
                    進行中
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#00A87E] transition-colors flex items-center gap-0.5">
                    查看課表 <ChevronRight className="w-3.5 h-3.5 inline" />
                  </span>
                )}
              </div>
            </div>

            <div className="w-36 sm:w-44 h-32 sm:h-36 shrink-0 relative overflow-hidden flex items-center justify-end">
              <img
                src="/images/plans/six_pack_abs.jpg"
                alt="六塊腹肌"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Row 3: 臀部 */}
          <motion.div
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const plan = WORKOUT_PLANS.find((p) => p.id === 'glutes_focus') || heroPlans[2];
              setPreviewPlan(plan);
            }}
            className="group relative flex items-center justify-between min-h-[130px] sm:min-h-[145px] pl-6 sm:pl-8 cursor-pointer hover:bg-slate-50/90 transition-colors overflow-hidden"
          >
            <div className="flex-1 pr-3 z-10 py-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#00A87E] transition-colors">
                臀部
              </h2>
              <div className="mt-2 flex items-center gap-2">
                {session.plan_id === 'glutes_focus' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C] text-white shadow-xs">
                    進行中
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#00A87E] transition-colors flex items-center gap-0.5">
                    查看課表 <ChevronRight className="w-3.5 h-3.5 inline" />
                  </span>
                )}
              </div>
            </div>

            <div className="w-36 sm:w-44 h-32 sm:h-36 shrink-0 relative overflow-hidden flex items-center justify-end">
              <img
                src="/images/plans/glutes_focus.jpg"
                alt="臀部"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>

        {/* ============================================================ */}
        {/* 2. 更多訓練分化課表 (推拉腿 PPL、二分化、五分化) */}
        {/* ============================================================ */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-black text-white flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-[#00D09C]" />
              Jeff Nippard 科學課表庫 ({WORKOUT_PLANS.length})
            </h3>
            <span className="text-[11px] text-slate-400 font-bold">
              雙重漸進 (8-12RM)
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: '全部課表' },
              { id: 'SpecialFocus', label: '🔥 30日焦點專項' },
              { id: 'PPL', label: '推拉腿 (PPL)' },
              { id: 'UpperLower', label: '二分化 (Upper/Lower)' },
              { id: 'BroSplit', label: '健美專項 / 全身頻率' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#00D09C] text-slate-950 shadow-sm font-black'
                    : 'bg-[#152347] text-slate-300 border border-slate-700/60 hover:bg-[#1A2C5B]'
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
                  className={`bg-[#132042] rounded-3xl p-4 sm:p-5 border transition-all cursor-pointer shadow-sm hover:shadow-md ${
                    isCurrent
                      ? 'border-[#00D09C] ring-2 ring-[#00D09C]/30 bg-[#162752]'
                      : 'border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C]/15 text-[#00D09C] border border-[#00D09C]/30">
                          {plan.categoryLabel}
                        </span>
                        {plan.nippardPrinciples?.scientificBasis && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                            🔬 {plan.nippardPrinciples.scientificBasis.split('+')[0]}
                          </span>
                        )}
                        {plan.duration && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700">
                            <Clock className="w-2.5 h-2.5" />
                            {plan.duration}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-black text-white">
                        {plan.name}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                        <span className="font-bold text-slate-200">
                          🎯 {plan.targetFocus}
                        </span>
                        <span>•</span>
                        <span>{plan.exercises.length} 個科學動作模組</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end justify-between self-stretch">
                      {isCurrent ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#00D09C] text-slate-950 flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                          使用中
                        </span>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-[#00D09C]/20 group-hover:text-[#00D09C] transition-colors">
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
              className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
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
                {/* Jeff Nippard Scientific Principles Box */}
                {previewPlan.nippardPrinciples && (
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                      <Sparkles className="w-3.5 h-3.5 text-[#00D09C]" />
                      <span>🔬 Jeff Nippard 運動科學與肌肥大指標</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                        <p className="text-slate-400 font-bold">生理機制</p>
                        <p className="text-slate-800 font-bold mt-0.5">{previewPlan.nippardPrinciples.scientificBasis}</p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                        <p className="text-slate-400 font-bold">強度保留</p>
                        <p className="text-slate-800 font-bold mt-0.5">{previewPlan.nippardPrinciples.repScheme}</p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                        <p className="text-slate-400 font-bold">訓練頻率</p>
                        <p className="text-slate-800 font-bold mt-0.5">{previewPlan.nippardPrinciples.frequency}</p>
                      </div>
                      <div className="bg-white/90 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                        <p className="text-slate-400 font-bold">每週容量</p>
                        <p className="text-slate-800 font-bold mt-0.5">{previewPlan.nippardPrinciples.weeklySets}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800 mb-1">📋 課表說明</p>
                  <p>{previewPlan.description}</p>
                  <p className="mt-2 text-slate-500 font-medium">
                    🎯 焦點肌群：<span className="text-slate-800 font-bold">{previewPlan.targetFocus}</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5">
                    包含科學動作模組 ({previewPlan.exercises.length})
                  </h4>
                  <div className="space-y-3">
                    {previewPlan.exercises.map((ex, idx) => (
                      <div
                        key={ex.exercise_id + idx}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
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

                        {/* Jeff Nippard Signature Biomechanical Cue */}
                        {ex.media.cue && (
                          <div className="text-[11px] text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100 leading-relaxed">
                            <span className="font-bold text-[#00A87E]">💡 Jeff 科學細節：</span>
                            {ex.media.cue}
                          </div>
                        )}
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
