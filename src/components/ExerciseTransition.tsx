// ============================================================
// HoldOn Coach — Exercise Transition
// 俐落的動作間切換轉場，保證卡片切換流暢且結算頁不卡死
// ============================================================

'use client';

import { motion } from 'framer-motion';
import { useWorkoutStore } from '@/stores/workoutStore';

interface ExerciseTransitionProps {
  children: React.ReactNode;
}

export default function ExerciseTransition({ children }: ExerciseTransitionProps) {
  const { currentExerciseIndex } = useWorkoutStore();

  return (
    <motion.div
      key={`exercise-trans-${currentExerciseIndex}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
