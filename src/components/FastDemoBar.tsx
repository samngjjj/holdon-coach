// ============================================================
// HoldOn Coach — Fast Demo Bar (全功能一鍵驗收展示列)
// 讓評測者與使用者一鍵驗收所有核心運動科學規則、安全踩煞車與結算報表
// ============================================================

'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowDownCircle,
  Flag,
  X,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';

interface FastDemoBarProps {
  onClose: () => void;
}

export default function FastDemoBar({ onClose }: FastDemoBarProps) {
  const {
    session,
    fastCompleteCurrentSet,
    fastTriggerStruggleDrop,
    fastTriggerPain,
    fastFinishAll,
  } = useWorkoutStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-amber-950/70 border-b border-amber-500/40 px-3 py-2 text-xs backdrop-blur-md"
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-amber-300 font-bold shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>⚡ 核心功能一鍵快速 Demo：</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Action 1: Normal Complete */}
          <button
            onClick={() => fastCompleteCurrentSet(8)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-medium transition-colors"
            title="模擬推滿 10 下，RPE 8 剛好，穩健推進"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>推滿1組 (RPE 8)</span>
          </button>

          {/* Action 2: Trigger "有點硬" RPE 9 -> Auto Drop Weight */}
          <button
            onClick={fastTriggerStruggleDrop}
            className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 flex items-center gap-1 font-medium transition-colors"
            title="驗收核心精神：說有點硬立即幫你調降重量！"
          >
            <ArrowDownCircle className="w-3 h-3 text-orange-400" />
            <span>回報有點硬 (降重保護)</span>
          </button>

          {/* Action 3: Trigger Tier-1 Pain */}
          <button
            onClick={fastTriggerPain}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1 font-medium transition-colors"
            title="喊肩膀痛：卡片琥珀色 + 換對握中立 + 降重 20%"
          >
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>喊肩膀刺痛 (Tier-1)</span>
          </button>

          {/* Action 4: Trigger Tier-2 Pain */}
          <button
            onClick={fastTriggerPain}
            className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 flex items-center gap-1 font-medium transition-colors"
            title="持續疼痛：卡片紅燈 + 強制更換為機械式"
          >
            <ShieldAlert className="w-3 h-3 text-red-400" />
            <span>二次疼痛 (Tier-2換機械)</span>
          </button>

          {/* Action 5: Finish & Show Summary */}
          <button
            onClick={fastFinishAll}
            className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 flex items-center gap-1 font-bold transition-colors"
            title="跳過其餘組數，直接結算今日總訓練量與營養加碼"
          >
            <Flag className="w-3 h-3 text-sky-400" />
            <span>結算看報表</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-amber-400/60 hover:text-amber-300 ml-auto p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
