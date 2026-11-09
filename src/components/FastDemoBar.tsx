// ============================================================
// HoldOn Coach — Fast Demo Bar (Clean Pill Style)
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
      className="bg-white border-b border-slate-200 shadow-sm px-3 py-2 text-xs"
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold shrink-0">
          <Zap className="w-3.5 h-3.5 text-[#FF6B4A]" />
          <span>⚡ 核心功能快速演練：</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Action 1: Normal Complete */}
          <button
            onClick={() => fastCompleteCurrentSet(8)}
            className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold transition-colors"
            title="模擬推滿 10 下，RPE 8 剛好，穩健推進"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>推滿1組 (RPE 8)</span>
          </button>

          {/* Action 2: Trigger "有點硬" RPE 9 -> Auto Drop Weight */}
          <button
            onClick={fastTriggerStruggleDrop}
            className="px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1 font-semibold transition-colors"
            title="驗收核心精神：說有點硬立即幫你調降重量！"
          >
            <ArrowDownCircle className="w-3 h-3 text-amber-600" />
            <span>回報有點硬 (降重保護)</span>
          </button>

          {/* Action 3: Trigger Tier-1 Pain */}
          <button
            onClick={fastTriggerPain}
            className="px-2.5 py-1 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1 font-semibold transition-colors"
            title="喊肩膀痛：卡片琥珀色 + 換對握中立 + 降重 20%"
          >
            <AlertTriangle className="w-3 h-3 text-orange-600" />
            <span>喊肩膀刺痛 (Tier-1)</span>
          </button>

          {/* Action 4: Trigger Tier-2 Pain */}
          <button
            onClick={fastTriggerPain}
            className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 font-semibold transition-colors"
            title="持續疼痛：卡片紅燈 + 強制更換為機械式"
          >
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>二次疼痛 (Tier-2換機械)</span>
          </button>

          {/* Action 5: Finish & Show Summary */}
          <button
            onClick={fastFinishAll}
            className="px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex items-center gap-1 font-bold transition-colors"
            title="跳過其餘組數，直接結算今日總訓練量與營養加碼"
          >
            <Flag className="w-3 h-3 text-sky-600" />
            <span>結算看報表</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 ml-auto p-1 rounded-full hover:bg-slate-100"
          title="收起快速列"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
