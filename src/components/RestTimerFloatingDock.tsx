// ============================================================
// HoldOn Coach — Rest Timer Floating Dock (Hevy Signature Mini Rest Bar)
// 模仿 Hevy 底端懸浮休息計時列：-15s、倒數進度條、+15s、跳過
// 不遮擋使用者瀏覽動作細節與歷史紀錄，亦可隨時點擊放大為全螢幕
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { Plus, Minus, SkipForward, Maximize2, Wind } from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useTimer } from '@/hooks/useTimer';

interface RestTimerFloatingDockProps {
  onExpandFullScreen?: () => void;
}

export default function RestTimerFloatingDock({ onExpandFullScreen }: RestTimerFloatingDockProps) {
  const {
    isResting,
    restSecondsRemaining,
    restDefaultSeconds,
    extendRest,
    tickRest,
    endRest,
    safetyTier,
    lastAdjustment,
    session,
    currentExerciseIndex,
  } = useWorkoutStore();

  useTimer({
    onTick: tickRest,
    isRunning: isResting,
  });

  if (!isResting) return null;

  const exercise = session.exercises[currentExerciseIndex];
  const minutes = Math.floor(restSecondsRemaining / 60);
  const seconds = restSecondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const maxRest = safetyTier >= 1 ? 120 : (lastAdjustment?.rpe === 9 ? 105 : restDefaultSeconds);
  const progressPct = Math.min(100, Math.max(0, (1 - restSecondsRemaining / maxRest) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      className="fixed bottom-20 inset-x-3 max-w-md mx-auto z-40 bg-[#0B132B]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-white"
    >
      {/* Top Animated Progress Bar */}
      <div className="w-full h-1 bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-[#00D09C]"
          style={{ width: `${progressPct}%` }}
          transition={{ ease: 'linear', duration: 1 }}
        />
      </div>

      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* -15s Button */}
        <button
          onClick={() => extendRest(-15)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold text-xs transition-colors flex items-center gap-0.5 active:scale-95"
          title="減少 15 秒休息"
        >
          <span>-15</span>
        </button>

        {/* Center Countdown & Exercise Preview */}
        <div
          onClick={onExpandFullScreen}
          className="flex-1 flex items-center justify-center gap-2 cursor-pointer group py-0.5"
          title="點擊放大為全螢幕專注計時"
        >
          <div className="w-6 h-6 rounded-full bg-[#00D09C]/15 flex items-center justify-center text-[#00D09C] group-hover:scale-110 transition-transform">
            <Wind className="w-3.5 h-3.5" />
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="font-mono font-black text-lg text-[#00D09C] tracking-wider tabular-nums leading-none">
                {timeFormatted}
              </span>
              <Maximize2 className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[130px] sm:max-w-[180px]">
              下一組：{exercise?.exercise_name || '準備做組'}
            </p>
          </div>
        </div>

        {/* +15s Button */}
        <button
          onClick={() => extendRest(15)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-mono font-bold text-xs transition-colors flex items-center gap-0.5 active:scale-95"
          title="延長 15 秒休息"
        >
          <span>+15</span>
        </button>

        {/* Skip Button */}
        <button
          onClick={endRest}
          className="px-3 py-1.5 rounded-xl bg-[#00D09C] hover:bg-[#00B98A] text-slate-950 font-black text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1"
        >
          <span>跳過</span>
          <SkipForward className="w-3 h-3 fill-slate-950" />
        </button>
      </div>
    </motion.div>
  );
}
