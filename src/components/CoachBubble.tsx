// ============================================================
// HoldOn Coach — Coach Feedback Bubble
// ============================================================

'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CoachBubbleProps {
  text: string;
  tone: 'encouraging' | 'warning' | 'celebrating' | 'calm';
}

const toneStyles = {
  encouraging: 'bg-zinc-800/80 border-zinc-700/50 text-zinc-300',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  celebrating: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
  calm: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
};

const toneAvatars = {
  encouraging: '🏋️',
  warning: '🛡️',
  celebrating: '🎉',
  calm: '😌',
};

export default function CoachBubble({ text, tone }: CoachBubbleProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={`flex items-start gap-3 p-3 rounded-2xl border ${toneStyles[tone]}`}
      >
        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-lg shrink-0">
          {toneAvatars[tone]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium opacity-60 mb-0.5">教練說</p>
          <p className="text-sm leading-relaxed">{text}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
