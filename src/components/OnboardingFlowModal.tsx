// ============================================================
// HoldOn Coach — Onboarding Flow Modal (新手多步驟引導流程)
// 徹底告別單一密集填表！採用 6 步直覺互動式引導：
// 1. 稱呼與性別 -> 2. 生理指標 (身高/體重/年齡) -> 3. 健身目標 -> 4. 關節舊傷檢查 -> 5. 程度評估 -> 6. 智慧課表配對
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  Zap,
  Flame,
  Award,
  Layers,
  Dumbbell,
  Sliders,
  Play,
  Activity,
  HeartPulse,
  Scale,
  Minus,
  Plus,
  Shield,
  Target,
  ArrowRight,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { calculateProfileStats, WORKOUT_PLANS, type UserProfile } from '@/data/exercises';

export default function OnboardingFlowModal() {
  const {
    userProfile,
    showOnboardingModal,
    setShowOnboardingModal,
    completeOnboarding,
  } = useWorkoutStore();

  // Ensure first-time visitors automatically see the onboarding modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isCompleted = localStorage.getItem('holdon_completed_onboarding') === 'true';
      if (!isCompleted) {
        setShowOnboardingModal(true);
      }
    }
  }, [setShowOnboardingModal]);

  // 6 步多步驟狀態
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form state
  const [formData, setFormData] = useState<UserProfile>({
    name: userProfile.name || '訓練者',
    gender: userProfile.gender || 'male',
    age: userProfile.age || 26,
    height_cm: userProfile.height_cm || 175,
    weight_kg: userProfile.weight_kg || 72,
    body_fat_pct: userProfile.body_fat_pct || 16.5,
    experience: userProfile.experience || 'beginner',
    goal: userProfile.goal || 'hypertrophy',
  });

  const [jointSensitivity, setJointSensitivity] = useState<'none' | 'shoulder' | 'lower_back' | 'knee'>('none');
  const [showOtherPlansForBeginner, setShowOtherPlansForBeginner] = useState(false);

  if (!showOnboardingModal) return null;

  const stats = calculateProfileStats(formData);

  // Experience level options (高中低三個新秀)
  const experienceOptions = [
    {
      id: 'beginner' as const,
      tag: '🌱 新秀新手 (低程度)',
      levelName: '剛接觸重訓 / 經驗 < 6 個月',
      desc: '處於神經徵召最高回報黃金期。動作模式建立與全身高頻刺激為首要之務。',
      recommendBadge: '🌟 系統將直接推薦【全身高頻率訓練】',
      accentColor: 'border-emerald-400 bg-emerald-50/50 text-emerald-950',
    },
    {
      id: 'intermediate' as const,
      tag: '⚡ 中階訓練者 (中程度)',
      levelName: '規律訓練 6 個月 ~ 2 年',
      desc: '具備基礎離心控制與肌肉知覺，需要週期化漸進超負荷與分化容量累積。',
      recommendBadge: '🔓 可自由挑選經典分化 (PPL/二分化) 或自訂',
      accentColor: 'border-sky-400 bg-sky-50/50 text-sky-950',
    },
    {
      id: 'advanced' as const,
      tag: '🔥 高階老手 (高程度)',
      levelName: '規律重訓 2 年以上',
      desc: '追求極限強度與大重量突破，精準微調做組次數、RIR 1-2 及自訂專屬動作編排。',
      recommendBadge: '🔓 完全解鎖：客製化課表編輯器 + 進階分化',
      accentColor: 'border-purple-400 bg-purple-50/50 text-purple-950',
    },
  ];

  const handleFinishWithFullBody = () => {
    completeOnboarding(formData, 'full_body_high_freq');
  };

  const handleFinishWithPlan = (planId: string) => {
    completeOnboarding(formData, planId);
  };

  const handleFinishWithCustomEditor = () => {
    completeOnboarding(formData, 'ppl_push', true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="bg-white border border-slate-200/90 rounded-[32px] w-full max-w-md shadow-2xl text-slate-800 overflow-hidden flex flex-col my-auto"
      >
        {/* Top Progress & Navigation Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s > 1 ? ((s - 1) as any) : 1))}
                  className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="返回上一步"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#00D09C]/15 text-[#00A87E] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00A87E] block">
                  HoldOn Coach • 專屬設定
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {step === 1 && '第 1 步：稱呼與性別'}
                  {step === 2 && '第 2 步：身體生理指標'}
                  {step === 3 && '第 3 步：首要健身目標'}
                  {step === 4 && '第 4 步：關節舊傷防護'}
                  {step === 5 && '第 5 步：訓練程度評估'}
                  {step === 6 && '第 6 步：智慧課表配對'}
                </span>
              </div>
            </div>

            <span className="text-xs font-mono font-black text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
              {step} / 6
            </span>
          </div>

          {/* 6-Step Smooth Segmented Progress Bar */}
          <div className="grid grid-cols-6 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= num
                    ? 'bg-[#00D09C] shadow-xs'
                    : 'bg-slate-200/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body Container with Smooth Slide Animations */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* STEP 1: 稱呼與性別 (Who are you?) */}
            {/* ======================================================== */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    歡迎加入！請問該如何稱呼你？
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    HoldOn AI 隨身教練將全程為你追蹤個人進度與保護關節。
                  </p>
                </div>

                {/* Name Input */}
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1.5">
                    你的稱呼 / 暱稱
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-2xl px-4 py-3 text-base font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#00D09C] focus:ring-2 focus:ring-[#00D09C]/20 transition-all"
                    placeholder="例如：Sam"
                    autoFocus
                  />
                </div>

                {/* Gender Cards */}
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">
                    生理性別（用於計算基礎代謝率與賀爾蒙配比）
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        formData.gender === 'male'
                          ? 'bg-emerald-50 border-[#00D09C] text-emerald-950 font-black shadow-xs ring-2 ring-[#00D09C]/20'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 font-bold'
                      }`}
                    >
                      <span className="text-3xl">👦</span>
                      <span className="text-sm">生理男性</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        formData.gender === 'female'
                          ? 'bg-emerald-50 border-[#00D09C] text-emerald-950 font-black shadow-xs ring-2 ring-[#00D09C]/20'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 font-bold'
                      }`}
                    >
                      <span className="text-3xl">👧</span>
                      <span className="text-sm">生理女性</span>
                    </button>
                  </div>
                </div>

                {/* CTA Next */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all cursor-pointer active:scale-98 mt-4"
                >
                  <span>下一步：輸入身體指標</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: 身體生理指標 (身高/體重/年齡) */}
            {/* ======================================================== */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    建立你的身體基本指標
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    用以精準計算你的起始安全負載與每日 TDEE 熱量消耗。
                  </p>
                </div>

                {/* 3 Interactive Metric Controls */}
                <div className="space-y-3">
                  {/* 身高 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">身高</span>
                      <span className="text-xl font-black text-slate-900 font-mono">
                        {formData.height_cm} <span className="text-xs font-normal text-slate-500">cm</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, height_cm: Math.max(120, formData.height_cm - 1) })}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center shadow-2xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, height_cm: Math.min(230, formData.height_cm + 1) })}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center shadow-2xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 體重 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">體重</span>
                      <span className="text-xl font-black text-slate-900 font-mono">
                        {formData.weight_kg} <span className="text-xs font-normal text-slate-500">kg</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, weight_kg: Math.max(30, Number((formData.weight_kg - 0.5).toFixed(1))) })}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center shadow-2xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, weight_kg: Math.min(200, Number((formData.weight_kg + 0.5).toFixed(1))) })}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center shadow-2xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 年齡 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 block">年齡</span>
                      <span className="text-xl font-black text-slate-900 font-mono">
                        {formData.age} <span className="text-xs font-normal text-slate-500">歲</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, age: Math.max(12, formData.age - 1) })}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center shadow-2xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, age: Math.min(90, formData.age + 1) })}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center shadow-2xs hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Calculated Baseline Feedback */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">BMI 體態指標</span>
                    <span className="font-mono font-black text-emerald-950 text-sm">{stats.bmi}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">每日建議 TDEE</span>
                    <span className="font-mono font-black text-emerald-950 text-sm">{stats.tdee} kcal</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">建議起始配重</span>
                    <span className="font-mono font-black text-[#00A87E] text-sm">{stats.recommendedPressKg} kg</span>
                  </div>
                </div>

                {/* CTA Next */}
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all cursor-pointer active:scale-98 mt-2"
                >
                  <span>下一步：選擇首要目標</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 3: 健身核心目標 (Fitness Goal) */}
            {/* ======================================================== */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    你的首要健身目標是什麼？
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    HoldOn 教練將依據目標調整雙重漸進配重與飲食碳水比重。
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'hypertrophy',
                      title: '增肌肌肥大 (Hypertrophy)',
                      desc: '最大化肌纖維機械張力，打造飽滿胸背肩與力量突破',
                      icon: '💪',
                    },
                    {
                      id: 'fat_loss',
                      title: '減脂塑形 (Fat Loss)',
                      desc: '燃燒多餘體脂，雕塑清晰核心六塊肌與緊實線條',
                      icon: '🔥',
                    },
                    {
                      id: 'joint_safety',
                      title: '關節零代償 (Joint Safety)',
                      desc: '建立正確運動力線，避免肩腰膝過載與代償受傷',
                      icon: '🛡️',
                    },
                  ].map((g) => {
                    const isSelected = formData.goal === g.id;
                    return (
                      <motion.div
                        key={g.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, goal: g.id as any })}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-50 border-[#00D09C] ring-2 ring-[#00D09C]/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl shrink-0">{g.icon}</span>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">
                              {g.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {g.desc}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-[#00D09C] bg-[#00D09C] text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA Next */}
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all cursor-pointer active:scale-98 mt-2"
                >
                  <span>下一步：關節防護檢查</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 4: 關節舊傷防護檢查 (Joint Safety) */}
            {/* ======================================================== */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-amber-500" />
                    <span>關節敏感與舊傷檢查</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    教練先別加防線！回報敏感部位，系統將自動啟動 2-Tier 代償煞車。
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'none',
                      title: '狀態極佳，無任何舊傷或不適',
                      desc: '關節活動度完整，可安全執行所有標準槓啞鈴複合動作',
                      badge: '✨ 全面開練',
                    },
                    {
                      id: 'shoulder',
                      title: '肩膀曾有舊傷 / 易卡關夾擠',
                      desc: '自動推薦 30° 上斜與對握中立握法，徹底釋放肩峰壓力',
                      badge: '🛡️ 鎖定中立握',
                    },
                    {
                      id: 'lower_back',
                      title: '下背 / 腰椎容易緊繃酸痛',
                      desc: '優先採用胸托式划船，完全卸除腰椎垂直剪切力',
                      badge: '🛡️ 胸托抗剪切',
                    },
                    {
                      id: 'knee',
                      title: '膝蓋微恙 / 曾有髕骨不適',
                      desc: '嚴格導引脛骨角度與髖鉸鏈主導深蹲，膝關節零代償',
                      badge: '🛡️ 髖鉸鏈主導',
                    },
                  ].map((j) => {
                    const isSelected = jointSensitivity === j.id;
                    return (
                      <motion.div
                        key={j.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setJointSensitivity(j.id as any)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300/30'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900">
                              {j.title}
                            </h4>
                            <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.2 rounded-full border border-slate-200 shadow-2xs">
                              {j.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {j.desc}
                          </p>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500 text-white'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA Next */}
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all cursor-pointer active:scale-98 mt-2"
                >
                  <span>下一步：選擇訓練程度 (高中低)</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 5: 訓練程度評估 (高中低三個新秀) */}
            {/* ======================================================== */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>選擇你的重訓經驗程度</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    科學化分級將直接決定你的推薦課表（新手全身 / 中高階分化）。
                  </p>
                </div>

                {/* 3 Tier Options */}
                <div className="space-y-3">
                  {experienceOptions.map((opt) => {
                    const isSelected = formData.experience === opt.id;
                    return (
                      <motion.div
                        key={opt.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, experience: opt.id })}
                        className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? `${opt.accentColor} ring-2 ring-emerald-400/30 shadow-md`
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-black text-slate-900">
                                {opt.tag}
                              </span>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C] text-white flex items-center gap-0.5">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  已選中
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-slate-600">
                              {opt.levelName}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {opt.desc}
                            </p>
                            <div className="mt-2 inline-block text-[10px] font-black text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                              {opt.recommendBadge}
                            </div>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? 'border-[#00D09C] bg-[#00D09C] text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA Next */}
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all cursor-pointer active:scale-98 mt-2"
                >
                  <span>下一步：配對專屬科學課表 →</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 6: 智慧課表配對與啟航 (AI Plan Match & Start) */}
            {/* ======================================================== */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                className="space-y-4"
              >
                {/* 6A. 新手新秀：直接推薦【Jeff Nippard 全身頻率訓練】 */}
                {formData.experience === 'beginner' && !showOtherPlansForBeginner ? (
                  <div className="space-y-3.5">
                    <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-[#00D09C]/50 rounded-3xl p-5 space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D09C] text-white text-xs font-black shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        新秀專屬推薦 • Jeff Nippard 全身頻率
                      </div>

                      <h3 className="text-xl font-black text-slate-900">
                        高頻全身肌肥大課表 (Full Body 3-Day)
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        🔬 <b className="text-slate-900">為什麼運動科學強烈建議新手全身訓練？</b><br />
                        新手初期肌肉蛋白質合成（MPS）窗口僅持續 24-36 小時。採用一週 2-3 次全身循環，神經徵召率與肌肥大總效益高出傳統單部位分化 200%，動作模式建立最扎實！
                      </p>

                      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 space-y-1">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                          <span>包含 4 大黃金複合動作：</span>
                          <span className="text-[#00A87E] font-mono font-black">
                            建議 {stats.recommendedPressKg}kg 起始
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          30° 上斜推胸 • 單臂胸托划船 • 高腳杯深蹲 • 核心抗伸展
                        </p>
                      </div>
                    </div>

                    {/* Primary CTA */}
                    <button
                      type="button"
                      onClick={handleFinishWithFullBody}
                      className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-[#00D09C]/25 transition-all cursor-pointer active:scale-98"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>立即採用全身訓練 (開啟 30 日計畫)</span>
                    </button>

                    {/* Secondary option */}
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setShowOtherPlansForBeginner(true)}
                        className="text-xs text-slate-400 hover:text-slate-700 underline transition-colors cursor-pointer"
                      >
                        我想自己挑選其他分化課表或自訂 →
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 6B. 中階 & 高階：自訂課表或選擇其他科學課表 */
                  <div className="space-y-3">
                    <div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black mb-1">
                        ⚡ {formData.experience === 'advanced' ? '高階老手專屬' : '中階訓練者解鎖'}
                      </div>
                      <h3 className="text-lg font-black text-slate-900">
                        選擇您的科學課表或【自訂課表】
                      </h3>
                      <p className="text-xs text-slate-400">
                        您可以直接進入課表編輯器客製動作，或挑選以下科學認證預設。
                      </p>
                    </div>

                    {/* Choice 1: 自訂專屬課表 (前往課表編輯器) */}
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFinishWithCustomEditor}
                      className="p-4 rounded-3xl bg-linear-to-r from-purple-500/15 via-purple-500/5 to-white border-2 border-purple-400 cursor-pointer hover:border-purple-500 transition-all shadow-xs group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                            <Sliders className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                                🛠️ 自訂專屬課表 (前往編輯器)
                              </h4>
                              <span className="text-[10px] font-black bg-purple-500 text-white px-2 py-0.2 rounded-full">
                                自由度最高
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              自由從動作庫挑選、增刪組數與自訂重量排序。
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>

                    {/* Choice 2: 推拉腿 (PPL) */}
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFinishWithPlan('ppl_push')}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#00D09C] cursor-pointer transition-all flex items-center justify-between shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00A87E] flex items-center justify-center font-black text-xs">
                          PPL
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900 group-hover:text-[#00D09C] transition-colors">
                              推拉腿 (The Ultimate PPL)
                            </h4>
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              Jeff 旗艦
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            推日 (胸肩三頭) • 拉日 (背二頭) • 腿日
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00D09C]" />
                    </motion.div>

                    {/* Choice 3: 二分化 (Upper / Lower) */}
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFinishWithPlan('upper_lower_upper')}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 cursor-pointer transition-all flex items-center justify-between shadow-2xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-xs">
                          U/L
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                              上下肢二分化 (Upper / Lower)
                            </h4>
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              效率首選
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            上半身發力日 + 下半身深層刺激，一週各部位 2 次
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-400" />
                    </motion.div>

                    {/* Choice 4: 名人教練專項 (大H 健體 & 卓叔瘦人增重) */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleFinishWithPlan('dah_3d_shoulders')}
                        className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-300 hover:border-amber-400 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] font-black bg-amber-500 text-white px-1.5 py-0.2 rounded">
                            🏆 大H
                          </span>
                          <span className="text-[9px] font-bold text-amber-800">IFBB PRO</span>
                        </div>
                        <p className="text-xs font-black text-slate-900 group-hover:text-amber-700">
                          3D南瓜肩與手臂
                        </p>
                        <p className="text-[10px] text-slate-500">V-Taper倒三角肩腰比</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFinishWithPlan('zhuo_hardgainer_a')}
                        className="p-2.5 rounded-2xl bg-orange-50/80 border border-orange-300 hover:border-orange-400 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[10px] font-black bg-orange-500 text-white px-1.5 py-0.2 rounded">
                            🍚 卓叔
                          </span>
                          <span className="text-[9px] font-bold text-orange-800">瘦人增肌</span>
                        </div>
                        <p className="text-xs font-black text-slate-900 group-hover:text-orange-700">
                          大動作黃金 A 日
                        </p>
                        <p className="text-[10px] text-slate-500">38分鐘速戰速決保熱量</p>
                      </button>
                    </div>

                    {/* Choice 5: 30日焦點專項 (腹部 / 六塊腹肌 / 臀部) */}
                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      {[
                        { id: 'fat_loss_belly', name: '腹部減脂', emoji: '🔥' },
                        { id: 'six_pack_abs', name: '六塊腹肌', emoji: '⚡' },
                        { id: 'glutes_focus', name: '翹臀微笑線', emoji: '🍑' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleFinishWithPlan(item.id)}
                          className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#00D09C] text-center transition-all group cursor-pointer"
                        >
                          <span className="text-base block mb-0.5">{item.emoji}</span>
                          <span className="text-[11px] font-black text-slate-700 group-hover:text-[#00D09C]">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Choice 5: 全身頻率 */}
                    <button
                      type="button"
                      onClick={handleFinishWithFullBody}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Dumbbell className="w-3.5 h-3.5 text-[#00A87E]" />
                      <span>我也想採用【高頻率全身日 (Full Body)】課表</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
