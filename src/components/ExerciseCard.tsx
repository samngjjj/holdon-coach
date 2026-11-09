// ============================================================
// HoldOn Coach — Exercise Focus Card (Screen 3: 訓練提示 - 30 Days Challenge Minimalist Clean Style)
// 極簡白底大卡片、動態運動軌跡示範、醒目綠色目標計數、大圓形打勾按鈕與關節防護煞車
// ============================================================

'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  AlertTriangle,
  Mic,
  MicOff,
  Video,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Edit3,
  Layers,
  ArrowDownCircle,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useVoiceListener } from '@/hooks/useVoiceListener';
import RPEInput from './RPEInput';
import PainInput from './PainInput';
import PlanEditorModal from './PlanEditorModal';
import ExerciseIllustration from './ExerciseIllustration';

export default function ExerciseCard() {
  const {
    session,
    currentExerciseIndex,
    currentSet,
    safetyTier,
    lastAdjustment,
    showRPEInput,
    showPainInput,
    showPlanEditorModal,
    setShowPlanEditorModal,
    jumpToExercise,
    reverseExercisesOrder,
    setShowRPEInput,
    setShowPainInput,
    completeSet,
    dropWeightManually,
    processVoiceCommand,
    resetSession,
  } = useWorkoutStore();

  const exercise = session.exercises[currentExerciseIndex];
  const [completedReps, setCompletedReps] = useState(exercise?.target_load.reps || 10);
  const [lastVoiceText, setLastVoiceText] = useState<string>('');
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Synchronize stepper whenever set advances or target reps calibrate
  useEffect(() => {
    if (exercise?.target_load?.reps) {
      setCompletedReps(exercise.target_load.reps);
    }
  }, [currentSet, currentExerciseIndex, exercise?.exercise_id, exercise?.target_load?.reps]);

  const handleVoice = useCallback(
    (transcript: string) => {
      setLastVoiceText(transcript);
      processVoiceCommand(transcript);
    },
    [processVoiceCommand]
  );

  const { isListening, isSupported, toggle: toggleVoice } = useVoiceListener({
    onTranscript: handleVoice,
  });

  if (!exercise) return null;

  const progressPct = (currentSet / exercise.total_sets) * 100;

  // Handle set completion trigger
  const handleComplete = () => {
    setShowRPEInput(true);
  };

  const handleRPESubmit = (rpe: number) => {
    completeSet(completedReps, rpe);
  };

  const isNeutral = safetyTier >= 1 || exercise.grip_type.includes('中立') || exercise.grip_type.includes('對握');

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-3 pb-24 text-slate-800 flex flex-col">
      {/* 1. Top Exercise Pill Switcher Bar (Screen 4 inspired) */}
      <div className="mb-2">
        <div className="flex items-center justify-between gap-2 mb-1.5 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Layers className="w-3.5 h-3.5 text-[#00D09C]" />
            <span>切換動作 ({currentExerciseIndex + 1}/{session.exercises.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={reverseExercisesOrder}
              className="text-[11px] font-semibold text-slate-600 hover:text-[#00D09C] bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1 transition-colors"
              title="前後次序調轉"
            >
              <RotateCcw className="w-3 h-3 text-[#00D09C]" />
              <span>前後調轉</span>
            </button>
            <button
              onClick={() => setShowPlanEditorModal(true)}
              className="text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3 text-[#FF6B4A]" />
              <span>修改課表</span>
            </button>
          </div>
        </div>

        {/* Scrollable Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {session.exercises.map((ex, idx) => {
            const isCurrent = idx === currentExerciseIndex;
            return (
              <button
                key={`${ex.exercise_id}_${idx}`}
                onClick={() => jumpToExercise(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isCurrent
                    ? 'bg-[#00D09C] text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-300'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 shadow-sm'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {idx + 1}
                </span>
                <span>{ex.exercise_name}</span>
                <span className={`text-[10px] ${isCurrent ? 'text-white/90' : 'text-slate-400'}`}>
                  {ex.target_load.weight_kg}kg
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Focus Card (Screen 3: 訓練提示 - Exact White Viewport Replica) */}
      <div
        className={`w-full bg-white rounded-3xl shadow-md border overflow-hidden transition-all duration-500 relative flex flex-col ${
          safetyTier === 2
            ? 'border-rose-400 ring-4 ring-rose-200'
            : safetyTier === 1
            ? 'border-amber-400 ring-4 ring-amber-200'
            : 'border-slate-200/90'
        }`}
      >
        {/* Progress Bar Line along the very top edge (Signature Screen 3 feature) */}
        <div className="w-full h-1.5 bg-slate-100 overflow-hidden">
          <motion.div
            className="h-full bg-[#00D09C]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>

        {/* Card Header: Back Arrow, Set Indicator, Orange Camera Video Button */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          {/* Back button */}
          <button
            onClick={resetSession}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
            title="返回課表"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Set Tracker Pill */}
          <div className="text-center">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
              第 {currentSet} / {exercise.total_sets} 組
            </span>
          </div>

          {/* Orange Camera Video Button (Screen 3 Feature!) */}
          <button
            onClick={() => setShowVideoModal(!showVideoModal)}
            className="w-9 h-9 rounded-full bg-[#FF6B4A] hover:bg-[#FF5530] text-white flex items-center justify-center shadow-md shadow-orange-500/30 transition-transform active:scale-95"
            title="查看發力角度與示範"
          >
            <Video className="w-4 h-4 fill-white" />
          </button>
        </div>

        {/* Safety Intervention Notice (if active) */}
        <AnimatePresence>
          {safetyTier === 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-amber-50 border-y border-amber-200 px-4 py-2 flex items-center gap-2 text-amber-800 text-xs font-bold"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>⚠️ Tier-1 關節防護：更換為對握中立握法，重量下調 20%！</span>
            </motion.div>
          )}
          {safetyTier === 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-50 border-y border-rose-200 px-4 py-2 flex items-center gap-2 text-rose-800 text-xs font-bold"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>🛑 Tier-2 強制換機：已自動切換為坐姿機械式胸推機固定軌跡保護！</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Visual Demonstration Area (Motion Trajectory with Blue Arrows) */}
        <div className="relative w-full h-52 bg-slate-50/60 border-b border-slate-100 flex items-center justify-center px-4 overflow-hidden">
          <ExerciseIllustration
            exerciseId={exercise.exercise_id}
            exerciseName={exercise.exercise_name}
            isNeutralGrip={isNeutral}
            className="w-full h-full"
          />

          {/* Biomechanical Form Cue Badge */}
          <div className="absolute bottom-2 inset-x-4 flex justify-center">
            <span className="bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-600 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm">
              💡 {exercise.media.cue}
            </span>
          </div>
        </div>

        {/* Dynamic Calibration Banner (Double Progression RPE Result) */}
        {lastAdjustment && (
          <div className="px-5 pt-3">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-2 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#00D09C] shrink-0" />
              <span className="font-semibold">{lastAdjustment.summary}</span>
            </div>
          </div>
        )}

        {/* Exercise Name & Big Mint Green Count (Signature Screen 3 Style) */}
        <div className="p-5 text-center flex flex-col items-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            {exercise.exercise_name}
          </h2>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {exercise.grip_type}
            </span>
            <span className="text-xs text-slate-400">
              • 目標推滿 12 下解鎖升重
            </span>
          </div>

          {/* HUGE VIBRANT GREEN TARGET LOAD DISPLAY (Screen 3: 'x 12' / '16kg × 12') */}
          <div className="my-2">
            <motion.div
              key={`${exercise.target_load.weight_kg}_${exercise.target_load.reps}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-[#00D09C] font-black text-4xl sm:text-5xl tracking-tight tabular-nums flex items-baseline justify-center gap-2"
            >
              <span>{exercise.target_load.weight_kg}kg</span>
              <span className="text-2xl text-slate-300 font-light">×</span>
              <span>{exercise.target_load.reps}</span>
            </motion.div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              目標配重與次數
            </p>
          </div>

          {/* Actual Reps Stepper Counter */}
          <div className="flex items-center gap-3 mt-2 mb-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 px-3">
            <button
              onClick={() => setCompletedReps(Math.max(1, completedReps - 1))}
              className="w-8 h-8 rounded-xl bg-white text-slate-600 font-bold text-lg flex items-center justify-center shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
            >
              −
            </button>
            <div className="px-2 text-center">
              <span className="text-[10px] text-slate-400 block font-medium">實際完成</span>
              <span className="text-lg font-black text-slate-800 tabular-nums">
                {completedReps} <span className="text-xs font-normal text-slate-500">下</span>
              </span>
            </div>
            <button
              onClick={() => setCompletedReps(Math.min(30, completedReps + 1))}
              className="w-8 h-8 rounded-xl bg-white text-slate-600 font-bold text-lg flex items-center justify-center shadow-sm hover:bg-slate-100 active:scale-95 transition-all"
            >
              +
            </button>
          </div>

          {/* 3. Bottom Controls: < [BIG GREEN CHECKMARK BUTTON] > (Exact Screen 3 Replica!) */}
          <div className="w-full flex items-center justify-center gap-8 pt-2 pb-1">
            {/* Previous set arrow */}
            <button
              onClick={() => setCompletedReps(Math.max(1, completedReps - 1))}
              className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              title="調降次數"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            {/* BIG VIBRANT GREEN ROUND CHECKMARK BUTTON */}
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleComplete}
              className="w-20 h-20 rounded-full bg-[#00D09C] hover:bg-[#00B887] text-white shadow-xl shadow-emerald-500/35 flex items-center justify-center transition-all cursor-pointer"
              title="完成當前組數"
            >
              <Check className="w-10 h-10 stroke-[3]" />
            </motion.button>

            {/* Next set arrow */}
            <button
              onClick={() => setCompletedReps(Math.min(30, completedReps + 1))}
              className="w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              title="提高次數"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* 4. HoldOn Coach Smart Safety Safeguards (Clean Minimalist Pills) */}
        <div className="px-5 pb-5 pt-1 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Pain Alert Button */}
          <button
            onClick={() => setShowPainInput(true)}
            className="flex-1 py-2 px-3 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>⚠️ 痛感煞車</span>
          </button>

          {/* Manual Drop Weight Button */}
          <button
            onClick={() => dropWeightManually('手動回報有點硬')}
            className="flex-1 py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowDownCircle className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span>有點硬 降重</span>
          </button>

          {/* Voice Listener Button */}
          <button
            onClick={toggleVoice}
            className={`py-2 px-3 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              isListening
                ? 'bg-emerald-500 border-emerald-500 text-white animate-pulse'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title="語音喊「推完了」、「有點硬」、「痛」"
          >
            {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isListening ? '監聽中' : '語音'}</span>
          </button>
        </div>
      </div>

      {/* Voice Prompt Helper Hint */}
      <div className="mt-3 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
        <span>🎙️ 語音可直接喊：「推完了」、「有點硬」、「肩膀痛」、「再休30秒」</span>
        {lastVoiceText && (
          <span className="text-[#00D09C] font-semibold ml-1">
            (聽到: &quot;{lastVoiceText}&quot;)
          </span>
        )}
      </div>

      {/* RPE & Pain Overlays */}
      <AnimatePresence>
        {showRPEInput && (
          <RPEInput
            onSubmit={handleRPESubmit}
            onCancel={() => setShowRPEInput(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPainInput && <PainInput />}
      </AnimatePresence>

      {/* Plan Editor Modal */}
      <PlanEditorModal
        isOpen={showPlanEditorModal}
        onClose={() => setShowPlanEditorModal(false)}
      />
    </div>
  );
}
