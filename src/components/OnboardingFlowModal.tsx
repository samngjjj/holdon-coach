// ============================================================
// HoldOn Coach — Onboarding Flow Modal (新手第一次登入完整導引流程)
// 1. 輸入個人生理資料 (暱稱、性別、年齡、身高、體重、目標、關節防護)
// 2. 選擇訓練程度：高中低三個新秀 (Beginner / Intermediate / Advanced)
// 3. 智慧課表配對分流：
//    - 新秀新手 (低) -> 直接推薦【Jeff Nippard 全身頻率訓練】
//    - 中階 & 高階 (中/高) -> 自由選擇其他科學分化 (PPL/二分化/專項) 或【自訂課表 (前往編輯器)】
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
  RotateCcw,
  Activity,
  HeartPulse,
  Scale,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { calculateProfileStats, WORKOUT_PLANS, type UserProfile } from '@/data/exercises';

export default function OnboardingFlowModal() {
  const {
    userProfile,
    hasCompletedOnboarding,
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

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state initialized from userProfile
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

  // Experience level options
  const experienceOptions = [
    {
      id: 'beginner' as const,
      tag: '🌱 新秀新手 (低程度)',
      levelName: '剛接觸重訓 / 經驗 < 6 個月',
      desc: '處於神經徵召最高回報黃金期。動作模式建立與全身高頻刺激為首要之務。',
      recommendBadge: '🌟 系統將直接推薦【全身頻率肌肥大】',
      color: 'from-emerald-500/20 to-teal-500/10 border-[#00D09C]',
    },
    {
      id: 'intermediate' as const,
      tag: '⚡ 中階訓練者 (中程度)',
      levelName: '規律訓練 6 個月 ~ 2 年',
      desc: '具備基礎離心控制與肌肉知覺，需要週期化超負荷與適度分化容量累積。',
      recommendBadge: '🔓 可自由挑選經典分化 (PPL/二分化) 或自訂',
      color: 'from-sky-500/20 to-blue-500/10 border-sky-400',
    },
    {
      id: 'advanced' as const,
      tag: '🔥 高階老手 (高程度)',
      levelName: '規律重訓 2 年以上',
      desc: '追求極限強度與大重量突破，精準微調做組次數、RIR 1-2 及自訂專屬動作編排。',
      recommendBadge: '🔓 完全解鎖：客製化課表編輯器 + 進階分化',
      color: 'from-purple-500/20 to-pink-500/10 border-purple-400',
    },
  ];

  const handleFinishWithFullBody = () => {
    completeOnboarding(formData, 'full_body_high_freq');
  };

  const handleFinishWithPlan = (planId: string) => {
    completeOnboarding(formData, planId);
  };

  const handleFinishWithCustomEditor = () => {
    // Select base plan then open custom plan editor modal
    completeOnboarding(formData, 'ppl_push', true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070D1E]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-[#0B132B] border border-slate-700/80 rounded-[32px] w-full max-w-lg shadow-2xl text-white overflow-hidden flex flex-col my-auto"
      >
        {/* Top Header & Step Progress Bar */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800/80 bg-gradient-to-b from-[#111C3D] to-[#0B132B]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#00D09C]/15 border border-[#00D09C]/30 flex items-center justify-center text-[#00D09C]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#00D09C] block">
                  HoldOn Coach • 運動科學引導
                </span>
                <h2 className="text-base font-black text-white leading-tight">
                  歡迎加入！設定您的專屬訓練檔案
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-400">步驟 {step} / 3</span>
            </div>
          </div>

          {/* Step Progress Pills */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { num: 1, label: '個人資料' },
              { num: 2, label: '程度評估' },
              { num: 3, label: '課表配對' },
            ].map((s) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= s.num ? 'bg-[#00D09C] shadow-sm shadow-[#00D09C]/50' : 'bg-slate-800'
                  }`}
                />
                <p
                  className={`text-[10px] font-bold text-center ${
                    step === s.num ? 'text-[#00D09C]' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
          <AnimatePresence mode="wait">
            {/* ======================================================== */}
            {/* STEP 1: 個人生理資料輸入 */}
            {/* ======================================================== */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-[#00D09C]" />
                    <span>先建立您的基本生理指標</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    HoldOn 將依據性別、體重與年齡，自動演算您的每日 TDEE 與安全起始配重。
                  </p>
                </div>

                {/* 暱稱與性別 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      您的稱呼 / 暱稱
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#152347] border border-slate-700 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D09C] transition-colors"
                      placeholder="例如：Sam"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      生理性別
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'male' })}
                        className={`py-2.5 rounded-2xl text-xs font-black border transition-all ${
                          formData.gender === 'male'
                            ? 'bg-[#00D09C] border-[#00D09C] text-slate-950 shadow-md'
                            : 'bg-[#152347] border-slate-700 text-slate-300 hover:bg-[#1A2C5B]'
                        }`}
                      >
                        男 ♂
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: 'female' })}
                        className={`py-2.5 rounded-2xl text-xs font-black border transition-all ${
                          formData.gender === 'female'
                            ? 'bg-[#00D09C] border-[#00D09C] text-slate-950 shadow-md'
                            : 'bg-[#152347] border-slate-700 text-slate-300 hover:bg-[#1A2C5B]'
                        }`}
                      >
                        女 ♀
                      </button>
                    </div>
                  </div>
                </div>

                {/* 年齡、身高、體重 */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-[#132042] p-3 rounded-2xl border border-slate-700/60 text-center">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">年齡 (歲)</label>
                    <input
                      type="number"
                      min={12}
                      max={90}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full bg-[#1A2C5B] border border-slate-600 rounded-xl py-1 text-center font-mono font-black text-base text-white focus:outline-none focus:border-[#00D09C]"
                    />
                  </div>

                  <div className="bg-[#132042] p-3 rounded-2xl border border-slate-700/60 text-center">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">身高 (cm)</label>
                    <input
                      type="number"
                      min={120}
                      max={230}
                      value={formData.height_cm}
                      onChange={(e) => setFormData({ ...formData, height_cm: Number(e.target.value) })}
                      className="w-full bg-[#1A2C5B] border border-slate-600 rounded-xl py-1 text-center font-mono font-black text-base text-white focus:outline-none focus:border-[#00D09C]"
                    />
                  </div>

                  <div className="bg-[#132042] p-3 rounded-2xl border border-slate-700/60 text-center">
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">體重 (kg)</label>
                    <input
                      type="number"
                      min={30}
                      max={200}
                      step={0.5}
                      value={formData.weight_kg}
                      onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                      className="w-full bg-[#1A2C5B] border border-slate-600 rounded-xl py-1 text-center font-mono font-black text-base text-white focus:outline-none focus:border-[#00D09C]"
                    />
                  </div>
                </div>

                {/* 主要目標選擇 */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    🎯 您的首要訓練目標
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'hypertrophy', label: '增肌肌肥大', icon: '💪' },
                      { id: 'fat_loss', label: '減脂線條', icon: '🔥' },
                      { id: 'joint_safety', label: '關節零代償', icon: '🛡️' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, goal: g.id as any })}
                        className={`p-2.5 rounded-2xl text-center border transition-all ${
                          formData.goal === g.id
                            ? 'bg-[#00D09C]/15 border-[#00D09C] text-[#00D09C] font-black'
                            : 'bg-[#152347] border-slate-700/60 text-slate-300 hover:bg-[#1A2C5B] text-xs font-bold'
                        }`}
                      >
                        <span className="text-base block mb-0.5">{g.icon}</span>
                        <span className="text-[11px]">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 關節舊傷防護檢查 */}
                <div className="bg-[#132042] p-3.5 rounded-2xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>關節防護檢查（教練先別加防線）</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    若有過往敏感部位，HoldOn 將在發力卡關或回報刺痛時，主動為您啟動 2-Tier 代償煞車。
                  </p>
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {[
                      { id: 'none', label: '無，狀態佳' },
                      { id: 'shoulder', label: '肩膀舊傷' },
                      { id: 'lower_back', label: '下背/腰椎' },
                      { id: 'knee', label: '膝蓋微恙' },
                    ].map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => setJointSensitivity(j.id as any)}
                        className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                          jointSensitivity === j.id
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                            : 'bg-[#1A2C5B] border-slate-700 text-slate-400 hover:bg-[#20346B]'
                        }`}
                      >
                        {j.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 即時數據預覽 */}
                <div className="bg-[#00D09C]/10 border border-[#00D09C]/30 rounded-2xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">BMI 評估</span>
                    <span className="font-mono font-black text-white text-sm">{stats.bmi}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">每日建議熱量 TDEE</span>
                    <span className="font-mono font-black text-[#00D09C] text-sm">{stats.tdee} kcal</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">建議起始臥推</span>
                    <span className="font-mono font-black text-amber-300 text-sm">{stats.recommendedPressKg} kg</span>
                  </div>
                </div>

                {/* Step 1 Next Button */}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all active:scale-[0.98]"
                >
                  <span>下一步：評估訓練程度 (高中低)</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 2: 選擇訓練經驗程度 (高中低三個新秀) */}
            {/* ======================================================== */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span>選擇您的重訓經驗程度</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    科學化分級有助於提供最佳訓練容量（Volume）與每週神經頻率配比。
                  </p>
                </div>

                {/* 3 Tier Options: 低 (新秀) / 中 (中階) / 高 (高階) */}
                <div className="space-y-3">
                  {experienceOptions.map((opt) => {
                    const isSelected = formData.experience === opt.id;
                    return (
                      <motion.div
                        key={opt.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFormData({ ...formData, experience: opt.id });
                        }}
                        className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-r ${opt.color} ${
                          isSelected
                            ? 'ring-2 ring-white/30 bg-[#162752] shadow-lg'
                            : 'opacity-70 hover:opacity-100 bg-[#132042]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-black text-white">
                                {opt.tag}
                              </span>
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00D09C] text-slate-950 flex items-center gap-0.5">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  已選擇
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-slate-300">
                              {opt.levelName}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                              {opt.desc}
                            </p>
                            <div className="mt-2.5 inline-block text-[10px] font-black text-[#00D09C] bg-[#00D09C]/10 px-2 py-0.5 rounded-lg border border-[#00D09C]/20">
                              {opt.recommendBadge}
                            </div>
                          </div>

                          <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 border-slate-500">
                            {isSelected && <div className="w-3 h-3 rounded-full bg-[#00D09C]" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3.5 rounded-2xl bg-[#152347] hover:bg-[#1A2C5B] text-slate-300 font-bold text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>上一步</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-3.5 rounded-2xl bg-[#00D09C] hover:bg-[#00B98A] text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00D09C]/25 transition-all"
                  >
                    <span>下一步：前往課表配對 →</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* STEP 3: 智慧課表配對與分流 */}
            {/* ======================================================== */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* ---------------------------------------------------- */}
                {/* 3A. 新秀新手：直接推薦【全身訓練】 */}
                {/* ---------------------------------------------------- */}
                {formData.experience === 'beginner' && !showOtherPlansForBeginner ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-emerald-500/20 via-[#00D09C]/15 to-teal-500/10 border border-[#00D09C]/50 rounded-3xl p-5 space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D09C] text-slate-950 text-xs font-black">
                        <Sparkles className="w-3.5 h-3.5" />
                        新秀專屬推薦 • Jeff Nippard 全身頻率訓練
                      </div>

                      <h3 className="text-xl font-black text-white">
                        高頻全身肌肥大課表 (Full Body 3-Day)
                      </h3>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        🔬 <b className="text-white">為什麼運動科學強烈建議新手全身訓練？</b><br />
                        新手初期肌肉蛋白質合成（MPS）窗口僅持續 24-36 小時。採用一週 2-3 次全身循環，神經徵召率與肌肥大總效益高出五分化 200%，動作模式建立最扎實！
                      </p>

                      <div className="bg-[#0B132B]/80 rounded-2xl p-3 border border-slate-700/60 space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                          <span>包含 5 大精選複合動作：</span>
                          <span className="text-[#00D09C] font-mono">建議 {stats.recommendedPressKg}kg 起始</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          1. 30° 上斜啞鈴推胸 • 2. 單臂啞鈴划船 • 3. 啞鈴高腳杯深蹲 • 4. 側平舉 • 5. 核心平板抗伸展
                        </p>
                      </div>
                    </div>

                    {/* Primary CTA: Start Full Body */}
                    <button
                      type="button"
                      onClick={handleFinishWithFullBody}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-[#00D09C] to-teal-400 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-[#00D09C]/30 hover:brightness-105 transition-all active:scale-[0.98]"
                    >
                      <Play className="w-5 h-5 fill-slate-950" />
                      <span>立即採用全身訓練 (開啟 30 日計畫)</span>
                    </button>

                    {/* Secondary option: Look at other plans */}
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setShowOtherPlansForBeginner(true)}
                        className="text-xs text-slate-400 hover:text-white underline transition-colors"
                      >
                        我想自己挑選其他分化課表或自訂 →
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ---------------------------------------------------- */
                  /* 3B. 中階 & 高階：自訂課表或選擇其他科學課表 */
                  /* ---------------------------------------------------- */
                  <div className="space-y-3.5">
                    <div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black mb-1">
                        ⚡ {formData.experience === 'advanced' ? '高階老手專屬' : '中階訓練者解鎖'}
                      </div>
                      <h3 className="text-lg font-black text-white">
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
                      className="p-4 rounded-3xl bg-gradient-to-r from-purple-500/20 via-[#1A2C5B] to-[#132042] border-2 border-purple-400/80 cursor-pointer hover:border-purple-300 transition-all shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                            <Sliders className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors">
                                🛠️ 自訂專屬課表 (前往課表編輯器)
                              </h4>
                              <span className="text-[10px] font-black bg-purple-400 text-slate-950 px-2 py-0.5 rounded-full">
                                自由度最高
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              自由從胸背腿肩動作庫挑選、增刪組數與配重、排序調整。
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>

                    {/* Choice 2: 推拉腿 (PPL) */}
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFinishWithPlan('ppl_push')}
                      className="p-3.5 rounded-2xl bg-[#132042] border border-slate-700/80 hover:border-[#00D09C] cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-[#00D09C] flex items-center justify-center font-black text-xs">
                          PPL
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-white group-hover:text-[#00D09C] transition-colors">
                              推拉腿 (The Ultimate PPL)
                            </h4>
                            <span className="text-[9px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                              Jeff 旗艦
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            推日 (胸肩三頭) • 拉日 (背二頭) • 腿日，雙重漸進 8-12RM
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#00D09C]" />
                    </motion.div>

                    {/* Choice 3: 二分化 (Upper / Lower) */}
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFinishWithPlan('upper_power')}
                      className="p-3.5 rounded-2xl bg-[#132042] border border-slate-700/80 hover:border-sky-400 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center font-black text-xs">
                          U/L
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-white group-hover:text-sky-400 transition-colors">
                              上下肢二分化 (Upper / Lower)
                            </h4>
                            <span className="text-[9px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                              效率首選
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            上半身發力日 + 下半身深層刺激，每週各部位刺激 2 次
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                    </motion.div>

                    {/* Choice 4: 30日焦點專項 (腹部 / 六塊腹肌 / 臀部) */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { id: 'fat_loss_belly', name: '腹部減脂', emoji: '🔥' },
                        { id: 'six_pack_abs', name: '六塊腹肌', emoji: '⚡' },
                        { id: 'glutes_focus', name: '翹臀微笑線', emoji: '🍑' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleFinishWithPlan(item.id)}
                          className="p-2.5 rounded-2xl bg-[#152347] border border-slate-700 hover:border-[#00D09C] text-center transition-all group"
                        >
                          <span className="text-base block mb-0.5">{item.emoji}</span>
                          <span className="text-[11px] font-black text-slate-200 group-hover:text-[#00D09C]">
                            {item.name}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Choice 5: 全身頻率 (Full Body) */}
                    <button
                      type="button"
                      onClick={handleFinishWithFullBody}
                      className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Dumbbell className="w-3.5 h-3.5 text-[#00D09C]" />
                      <span>我也想採用【全身頻率肌肥大 (Full Body)】課表</span>
                    </button>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (showOtherPlansForBeginner) {
                        setShowOtherPlansForBeginner(false);
                      } else {
                        setStep(2);
                      }
                    }}
                    className="w-full py-3 rounded-2xl bg-[#152347] hover:bg-[#1A2C5B] text-slate-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>返回上一步</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
