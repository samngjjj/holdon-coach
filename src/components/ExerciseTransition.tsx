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
  const { currentExerciseIndex, session } = useWorkoutStore();
  const currentEx = session.exercises[currentExerciseIndex];
  const transitionKey = currentEx
    ? `${currentExerciseIndex}_${currentEx.exercise_id}`
    : `exercise-trans-${currentExerciseIndex}`;

  return (
    <motion.div
      key={transitionKey}
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
