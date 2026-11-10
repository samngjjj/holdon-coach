// ============================================================
// HoldOn Coach — High-Fidelity Anatomical Exercise Illustration
// 徹底解決「看不懂動作點做」：人體工學寫實線條、分步定格 (離心下放 vs 向心推起)
// 目標肌群高亮收縮、發力軌跡弧線與即時動作階段導引
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Check, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';

interface ExerciseIllustrationProps {
  exerciseId: string;
  exerciseName: string;
  className?: string;
  isNeutralGrip?: boolean;
  onOpenGuide?: () => void;
}

type PhaseMode = 'loop' | 'bottom' | 'top';

export default function ExerciseIllustration({
  exerciseId,
  exerciseName,
  className = '',
  isNeutralGrip = false,
  onOpenGuide,
}: ExerciseIllustrationProps) {
  const normId = (exerciseId || '').toLowerCase();
  const [phaseMode, setPhaseMode] = useState<PhaseMode>('loop');

  // Animation values based on phase mode
  // 0 = bottom/stretch (離心下放拉伸), 1 = top/contraction (向心推起收縮)
  const isLoop = phaseMode === 'loop';
  const isBottom = phaseMode === 'bottom';
  const isTop = phaseMode === 'top';

  // ============================================================
  // 1. 30° 上斜啞鈴臥推 (Incline Dumbbell Press)
  // ============================================================
  if (normId.includes('incline') && (normId.includes('press') || normId.includes('推'))) {
    return (
      <div className={`relative flex flex-col items-center justify-center w-full h-full select-none ${className}`}>
        {/* Phase Toggle Controls (點選定格查看「點做」) */}
        <div className="absolute top-2 inset-x-3 z-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-0.5 rounded-full border border-slate-200/90 shadow-2xs text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setPhaseMode('loop')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isLoop ? 'bg-[#00D09C] text-white shadow-2xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              🔄 動態循環
            </button>
            <button
              type="button"
              onClick={() => setPhaseMode('bottom')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isBottom ? 'bg-amber-500 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ① 下放拉伸 (Bottom)
            </button>
            <button
              type="button"
              onClick={() => setPhaseMode('top')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isTop ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ② 推起收縮 (Top)
            </button>
          </div>

          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="px-2.5 py-0.5 rounded-full bg-white/95 text-slate-700 hover:text-[#00A87E] border border-slate-200 text-[10px] font-black shadow-2xs transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#FF6B4A]" />
              <span>動作詳解</span>
            </button>
          )}
        </div>

        {/* SVG Anatomical Canvas */}
        <svg viewBox="0 0 360 220" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
          {/* Gym Floor / Mat */}
          <line x1="20" y1="200" x2="340" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="204" x2="330" y2="204" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="6 6" />

          {/* 30° Incline Bench Frame (Steel Hardware) */}
          {/* Floor base */}
          <line x1="55" y1="200" x2="235" y2="200" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          {/* Front post */}
          <line x1="85" y1="200" x2="85" y2="155" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
          {/* Main incline spine (30 degrees) */}
          <line x1="85" y1="155" x2="215" y2="80" stroke="#334155" strokeWidth="8" strokeLinecap="round" />
          {/* Angle support strut */}
          <line x1="160" y1="200" x2="160" y2="112" stroke="#64748B" strokeWidth="5" strokeLinecap="round" />

          {/* Seat Cushion (15° slight tilt to prevent sliding) */}
          <line x1="60" y1="155" x2="105" y2="160" stroke="#0F172A" strokeWidth="12" strokeLinecap="round" />
          <line x1="62" y1="155" x2="103" y2="160" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

          {/* Backrest Cushion (30° incline pad with premium leather seam) */}
          <line x1="85" y1="155" x2="215" y2="80" stroke="#0F172A" strokeWidth="14" strokeLinecap="round" />
          <line x1="88" y1="153" x2="212" y2="82" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />

          {/* Athlete: Lower Body (Planting feet firmly on ground) */}
          {/* Left Foot & Sneaker on floor */}
          <rect x="70" y="192" width="30" height="8" rx="3" fill="#0F172A" />
          <path d="M70 196 L100 196" stroke="#00D09C" strokeWidth="2" />
          {/* Lower leg vertical */}
          <line x1="82" y1="192" x2="82" y2="152" stroke="#475569" strokeWidth="9" strokeLinecap="round" />
          {/* Pelvis / Buttocks on seat */}
          <circle cx="98" cy="150" r="14" fill="#334155" />

          {/* Athlete: Torso (Lying back on 30° incline) */}
          <path d="M98 145 L180 98" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
          {/* Ribcage & Spine support */}
          <path d="M105 142 L175 101" stroke="#475569" strokeWidth="12" strokeLinecap="round" />

          {/* Target Muscle: Pectoralis Major (Upper Chest Highlight) */}
          {/* Stretches and pulses in mint green */}
          <motion.path
            d="M 152 110 Q 168 95 178 92"
            stroke="#00D09C"
            strokeWidth="10"
            strokeLinecap="round"
            animate={
              isLoop
                ? { stroke: ['#00D09C', '#10B981', '#00D09C'], strokeWidth: [8, 12, 8] }
                : isTop
                ? { stroke: '#00D09C', strokeWidth: 12 }
                : { stroke: '#64748B', strokeWidth: 7 }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Head & Neck resting comfortably on headrest */}
          <path d="M178 95 L190 88" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
          {/* Head with neutral gaze upward-forward */}
          <circle cx="202" cy="80" r="13" fill="#0F172A" />
          <circle cx="204" cy="80" r="11" fill="#FDBA74" />
          {/* Hair / Headband */}
          <path d="M194 72 Q 206 68 214 76" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Kinetic Arms & Dumbbell Press Movement */}
          {/* Animated group moving along the 30° pressing trajectory */}
          <motion.g
            animate={
              isLoop
                ? { x: [0, 24, 0], y: [0, -32, 0] }
                : isTop
                ? { x: 24, y: -32 }
                : { x: 0, y: 0 }
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Shoulder Pivot Socket */}
            <circle cx="160" cy="100" r="7" fill="#64748B" />

            {/* Upper Arm (Humerus) — 45 deg tuck at bottom, extending up at top */}
            <path
              d="M 160 100 L 148 76 L 158 52"
              stroke="#FDBA74"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Forearm & Wrist (Kept vertical throughout press) */}
            <path
              d="M 148 76 L 158 52"
              stroke="#FB923C"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Dumbbell Assembly */}
            {/* Grip handle */}
            <rect
              x="142"
              y="48"
              width="32"
              height="8"
              rx="3"
              fill="#E2E8F0"
              transform="rotate(-15 158 52)"
            />
            {/* Inner Plate */}
            <circle
              cx="146"
              cy="55"
              r="12"
              fill="#0F172A"
              stroke={isNeutralGrip ? '#00D09C' : '#334155'}
              strokeWidth="2.5"
            />
            <circle cx="146" cy="55" r="5" fill="#64748B" />

            {/* Outer Plate */}
            <circle
              cx="170"
              cy="49"
              r="12"
              fill="#0F172A"
              stroke={isNeutralGrip ? '#00D09C' : '#334155'}
              strokeWidth="2.5"
            />
            <circle cx="170" cy="49" r="5" fill="#64748B" />

            {/* Weight Stamp */}
            <text x="141" y="58" fontSize="7" fontWeight="bold" fill="#94A3B8">
              KG
            </text>
          </motion.g>

          {/* Biomechanical Motion Trajectory Arc (Sky Blue Dashed Line) */}
          <path
            d="M 158 52 Q 170 32 182 20"
            stroke="#38BDF8"
            strokeWidth="3"
            strokeDasharray="4 4"
            fill="none"
          />
          {/* Arrowhead pointing upward-inward */}
          <polygon points="182,14 189,24 177,24" fill="#38BDF8" transform="rotate(30 182 20)" />

          {/* Angle Callout: 30° Incline */}
          <path d="M 180 200 A 30 30 0 0 1 195 186" stroke="#94A3B8" strokeWidth="1.5" fill="none" />
          <text x="198" y="194" fontSize="9" fontWeight="bold" fill="#64748B">
            30°
          </text>
        </svg>

        {/* Real-time Status Caption Badge (清楚告訴你原本是點做、當前階段) */}
        <div className="absolute bottom-1.5 inset-x-3 flex justify-center">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-2">
            {isBottom ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-amber-300">① 底部拉伸位：</span>
                <span className="text-slate-200">手肘下沉呈 45° 內收，感受上胸深層拉伸</span>
              </>
            ) : isTop ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#00D09C] shrink-0" />
                <span className="text-[#00D09C]">② 頂部收縮位：</span>
                <span className="text-slate-200">向上微內夾推起，肘部微曲不鎖死</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0" />
                <span className="text-sky-300">標準動作軌跡：</span>
                <span className="text-slate-200">沉肩收胛 ➔ 慢放 2 秒拉伸 ➔ 爆發推起 1 秒</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. 平板啞鈴臥推 (Flat Dumbbell Press)
  // ============================================================
  if (normId.includes('flat') && (normId.includes('press') || normId.includes('推'))) {
    return (
      <div className={`relative flex flex-col items-center justify-center w-full h-full select-none ${className}`}>
        {/* Phase Toggle Controls */}
        <div className="absolute top-2 inset-x-3 z-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-0.5 rounded-full border border-slate-200/90 shadow-2xs text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setPhaseMode('loop')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isLoop ? 'bg-[#00D09C] text-white shadow-2xs font-black' : 'text-slate-500'
              }`}
            >
              🔄 動態循環
            </button>
            <button
              type="button"
              onClick={() => setPhaseMode('bottom')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isBottom ? 'bg-amber-500 text-white shadow-2xs font-black' : 'text-slate-500'
              }`}
            >
              ① 下放胸口
            </button>
            <button
              type="button"
              onClick={() => setPhaseMode('top')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isTop ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500'
              }`}
            >
              ② 推至正上方
            </button>
          </div>

          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="px-2.5 py-0.5 rounded-full bg-white/95 text-slate-700 hover:text-[#00A87E] border border-slate-200 text-[10px] font-black shadow-2xs transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#FF6B4A]" />
              <span>動作詳解</span>
            </button>
          )}
        </div>

        <svg viewBox="0 0 360 220" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
          <line x1="20" y1="200" x2="340" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Flat Bench */}
          <line x1="75" y1="200" x2="75" y2="150" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <line x1="265" y1="200" x2="265" y2="150" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <line x1="55" y1="150" x2="285" y2="150" stroke="#0F172A" strokeWidth="14" strokeLinecap="round" />
          <line x1="58" y1="150" x2="282" y2="150" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />

          {/* Athlete Lying Flat */}
          {/* Feet on floor */}
          <rect x="65" y="192" width="28" height="8" rx="3" fill="#0F172A" />
          <line x1="78" y1="192" x2="105" y2="148" stroke="#475569" strokeWidth="9" strokeLinecap="round" />

          {/* Torso & Head */}
          <path d="M105 145 L250 145" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
          {/* Active Chest Muscle */}
          <motion.path
            d="M 160 142 L 205 142"
            stroke="#00D09C"
            strokeWidth="11"
            strokeLinecap="round"
            animate={
              isLoop
                ? { strokeWidth: [8, 12, 8] }
                : isTop
                ? { strokeWidth: 12 }
                : { strokeWidth: 8 }
            }
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <circle cx="260" cy="140" r="12" fill="#FDBA74" />
          <circle cx="262" cy="138" r="13" stroke="#0F172A" strokeWidth="3" fill="none" />

          {/* Vertical Pressing Arms & Dumbbells */}
          <motion.g
            animate={
              isLoop
                ? { y: [0, -42, 0] }
                : isTop
                ? { y: -42 }
                : { y: 0 }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Arms extending straight up */}
            <path d="M 180 140 L 180 92 L 180 62" stroke="#FDBA74" strokeWidth="9" strokeLinecap="round" />

            {/* Dumbbell */}
            <rect x="155" y="58" width="50" height="8" rx="3" fill="#E2E8F0" />
            <circle cx="155" cy="62" r="13" fill="#0F172A" stroke="#00D09C" strokeWidth="2" />
            <circle cx="205" cy="62" r="13" fill="#0F172A" stroke="#00D09C" strokeWidth="2" />
            <circle cx="155" cy="62" r="5" fill="#64748B" />
            <circle cx="205" cy="62" r="5" fill="#64748B" />
          </motion.g>

          {/* Upward Cyan Trajectory Arrow */}
          <path d="M 180 115 L 180 40" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          <polygon points="180,32 186,44 174,44" fill="#38BDF8" />
        </svg>

        <div className="absolute bottom-1.5 inset-x-3 flex justify-center">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D09C] shrink-0" />
            <span>平板臥推要領：沉肩收胛貼死椅面，手腕垂直手肘，推至胸前正上方</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 3. 啞鈴側平舉 (Dumbbell Lateral Raise)
  // ============================================================
  if (normId.includes('lateral') || normId.includes('側平舉')) {
    return (
      <div className={`relative flex flex-col items-center justify-center w-full h-full select-none ${className}`}>
        {/* Phase Toggle Controls */}
        <div className="absolute top-2 inset-x-3 z-10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-0.5 rounded-full border border-slate-200/90 shadow-2xs text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setPhaseMode('loop')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isLoop ? 'bg-[#00D09C] text-white shadow-2xs font-black' : 'text-slate-500'
              }`}
            >
              🔄 動態循環
            </button>
            <button
              type="button"
              onClick={() => setPhaseMode('bottom')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isBottom ? 'bg-amber-500 text-white shadow-2xs font-black' : 'text-slate-500'
              }`}
            >
              ① 大腿兩側
            </button>
            <button
              type="button"
              onClick={() => setPhaseMode('top')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                isTop ? 'bg-emerald-600 text-white shadow-2xs font-black' : 'text-slate-500'
              }`}
            >
              ② 水平抬起
            </button>
          </div>

          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="px-2.5 py-0.5 rounded-full bg-white/95 text-slate-700 hover:text-[#00A87E] border border-slate-200 text-[10px] font-black shadow-2xs transition-all cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#FF6B4A]" />
              <span>動作詳解</span>
            </button>
          )}
        </div>

        <svg viewBox="0 0 360 220" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
          <line x1="40" y1="200" x2="320" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Standing Legs */}
          <line x1="165" y1="200" x2="173" y2="135" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          <line x1="195" y1="200" x2="187" y2="135" stroke="#334155" strokeWidth="10" strokeLinecap="round" />

          {/* Torso Standing with 15° slight athletic forward lean */}
          <path d="M180 135 L180 75" stroke="#475569" strokeWidth="16" strokeLinecap="round" />

          {/* Target Shoulders (Middle Deltoids Highlight) */}
          <circle cx="158" cy="78" r="9" fill="#00D09C" />
          <circle cx="202" cy="78" r="9" fill="#00D09C" />

          {/* Head & Neck */}
          <circle cx="180" cy="55" r="13" fill="#FDBA74" />
          <path d="M172 45 Q 180 40 188 45" stroke="#0F172A" strokeWidth="4" fill="none" />

          {/* Left Arm Raising in Scapular Plane (30 deg forward) */}
          <motion.g
            animate={
              isLoop
                ? { rotate: [12, -48, 12] }
                : isTop
                ? { rotate: -48 }
                : { rotate: 12 }
            }
            style={{ transformOrigin: '158px 78px' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M158 78 L122 108 L88 122" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
            <circle cx="85" cy="122" r="10" fill="#0F172A" stroke="#00D09C" strokeWidth="2" />
          </motion.g>

          {/* Right Arm Raising in Scapular Plane */}
          <motion.g
            animate={
              isLoop
                ? { rotate: [-12, 48, -12] }
                : isTop
                ? { rotate: 48 }
                : { rotate: -12 }
            }
            style={{ transformOrigin: '202px 78px' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M202 78 L238 108 L272 122" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
            <circle cx="275" cy="122" r="10" fill="#0F172A" stroke="#00D09C" strokeWidth="2" />
          </motion.g>

          {/* Curved Arc Cyan Trajectory Arrows */}
          <path d="M 85 145 Q 65 110 92 82" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          <polygon points="92,82 86,92 98,90" fill="#38BDF8" />

          <path d="M 275 145 Q 295 110 268 82" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          <polygon points="268,82 262,90 274,92" fill="#38BDF8" />
        </svg>

        <div className="absolute bottom-1.5 inset-x-3 flex justify-center">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D09C] shrink-0" />
            <span>側平舉要領：手肘引導向側前方 30° 抬起，沉肩不聳肩，小重量慢速控制</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 4. 坐姿機械胸推機 (Machine Chest Press — Tier 2 關節防護)
  // ============================================================
  if (normId.includes('machine') || normId.includes('機械')) {
    return (
      <div className={`relative flex flex-col items-center justify-center w-full h-full select-none ${className}`}>
        <svg viewBox="0 0 360 220" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
          <line x1="30" y1="200" x2="330" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

          {/* Machine Heavy Frame */}
          <rect x="70" y="50" width="16" height="150" fill="#334155" rx="3" />
          <rect x="70" y="80" width="80" height="12" fill="#475569" rx="2" />
          {/* Weight Stack */}
          <rect x="50" y="80" width="30" height="90" fill="#1E293B" rx="3" />
          <line x1="65" y1="80" x2="65" y2="170" stroke="#94A3B8" strokeWidth="3" />

          {/* Machine Seat & Backrest */}
          <rect x="170" y="160" width="50" height="10" fill="#0F172A" rx="2" />
          <line x1="195" y1="170" x2="195" y2="200" stroke="#475569" strokeWidth="8" />
          {/* Vertical Backrest Pad */}
          <rect x="165" y="85" width="12" height="75" fill="#0F172A" rx="3" />

          {/* Athlete Sitting Straight against Pad */}
          <path d="M180 160 L180 90" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
          {/* Active Chest Highlight */}
          <circle cx="195" cy="115" r="8" fill="#00D09C" />
          <circle cx="180" cy="72" r="13" fill="#FDBA74" />

          {/* Machine Push Arms & Handles (Moving horizontally forward) */}
          <motion.g
            animate={
              isLoop
                ? { x: [0, 36, 0] }
                : isTop
                ? { x: 36 }
                : { x: 0 }
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Machine Lever Bar */}
            <line x1="150" y1="85" x2="200" y2="120" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            {/* Rubber Grip Handle */}
            <rect x="195" y="112" width="12" height="24" rx="4" fill="#00D09C" />
            {/* Athlete's Forearm pushing forward */}
            <path d="M 180 115 L 202 124" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
          </motion.g>

          {/* Horizontal Cyan Trajectory Arrow */}
          <path d="M 215 124 L 265 124" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          <polygon points="265,124 256,119 256,129" fill="#38BDF8" />
        </svg>

        <div className="absolute bottom-1.5 inset-x-3 flex justify-center">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D09C] shrink-0" />
            <span>機械胸推要領：固定軌跡零肩峰晃動，把手對準胸口中下線，平穩向前推滿</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 5. 預設通用力量動作 (Default Athletic Free Weight / Strength)
  // ============================================================
  return (
    <div className={`relative flex flex-col items-center justify-center w-full h-full select-none ${className}`}>
      <svg viewBox="0 0 360 220" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
        <line x1="30" y1="200" x2="330" y2="200" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />

        {/* Bench / Seat */}
        <rect x="155" y="145" width="50" height="12" fill="#0F172A" rx="3" />
        <line x1="180" y1="157" x2="180" y2="200" stroke="#475569" strokeWidth="8" />

        {/* Athlete Sitting */}
        <circle cx="180" cy="70" r="14" fill="#FDBA74" />
        <path d="M180 84 L180 145" stroke="#334155" strokeWidth="16" strokeLinecap="round" />

        {/* Target Muscle Accent */}
        <circle cx="180" cy="100" r="9" fill="#00D09C" />

        {/* Vertical Press/Curl Motion */}
        <motion.g
          animate={
            isLoop
              ? { y: [0, -28, 0] }
              : isTop
              ? { y: -28 }
              : { y: 0 }
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Arms holding dumbbell */}
          <path d="M 160 100 L 140 85 L 140 60" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
          <path d="M 200 100 L 220 85 L 220 60" stroke="#FDBA74" strokeWidth="8" strokeLinecap="round" />
          <circle cx="140" cy="60" r="10" fill="#0F172A" stroke="#00D09C" strokeWidth="2" />
          <circle cx="220" cy="60" r="10" fill="#0F172A" stroke="#00D09C" strokeWidth="2" />
        </motion.g>

        {/* Trajectory */}
        <path d="M 220 85 L 220 40" stroke="#38BDF8" strokeWidth="3" strokeDasharray="4 4" fill="none" />
        <polygon points="220,35 225,44 215,44" fill="#38BDF8" />
      </svg>

      <div className="absolute bottom-1.5 inset-x-3 flex justify-center">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D09C] shrink-0" />
          <span>核心要領：沉肩收腹，維持目標肌群持續張力，不靠甩動借力</span>
        </div>
      </div>
    </div>
  );
}
