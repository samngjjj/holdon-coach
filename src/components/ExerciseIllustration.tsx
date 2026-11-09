// ============================================================
// HoldOn Coach — Clean Exercise Illustration with Motion Trajectory Arrows
// 參考 30 Days Challenge / Leap Fitness 簡潔幾何線條與動態軌跡箭頭
// ============================================================

'use client';

import { motion } from 'framer-motion';

interface ExerciseIllustrationProps {
  exerciseId: string;
  exerciseName: string;
  className?: string;
  isNeutralGrip?: boolean;
}

export default function ExerciseIllustration({
  exerciseId,
  exerciseName,
  className = '',
  isNeutralGrip = false,
}: ExerciseIllustrationProps) {
  const normId = (exerciseId || '').toLowerCase();

  // 1. 上斜臥推 (Incline Press)
  if (normId.includes('incline') && normId.includes('press')) {
    return (
      <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
        <svg viewBox="0 0 320 200" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
          {/* Floor / Mat */}
          <line x1="20" y1="185" x2="300" y2="185" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
          
          {/* Incline Bench (30-45 deg) */}
          <line x1="60" y1="185" x2="90" y2="140" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
          <line x1="160" y1="185" x2="160" y2="110" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
          {/* Back rest pad */}
          <line x1="75" y1="150" x2="200" y2="70" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
          {/* Seat pad */}
          <line x1="65" y1="150" x2="105" y2="155" stroke="#334155" strokeWidth="10" strokeLinecap="round" />

          {/* Torso lying on bench */}
          <path d="M95 145 L180 85" stroke="#FDA4AF" strokeWidth="14" strokeLinecap="round" />
          {/* Head */}
          <circle cx="195" cy="72" r="14" fill="#F43F5E" />
          
          {/* Arms with Dumbbell & Pressing Motion */}
          <motion.g
            animate={{ y: [8, -12, 8] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Upper Arm & Forearm */}
            <path d="M150 105 L165 75 L175 42" stroke="#FDA4AF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Dumbbell */}
            <rect x="155" y="36" width="40" height="8" rx="3" fill="#1E293B" transform="rotate(-15 175 40)" />
            <circle cx="160" cy="40" r="9" fill={isNeutralGrip ? "#00D09C" : "#F97316"} />
            <circle cx="190" cy="32" r="9" fill={isNeutralGrip ? "#00D09C" : "#F97316"} />
          </motion.g>

          {/* Light Blue Motion Trajectory Arrow (Signature Leap Fitness style) */}
          <motion.path
            d="M 140 70 Q 155 45 175 22"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
            fill="none"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          {/* Arrowhead */}
          <polygon points="175,16 182,26 170,26" fill="#38BDF8" transform="rotate(35 175 22)" />
        </svg>

        {isNeutralGrip && (
          <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            中立握法保護中 🛡️
          </span>
        )}
      </div>
    );
  }

  // 2. 平板臥推 (Flat Press)
  if (normId.includes('flat') && normId.includes('press')) {
    return (
      <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
        <svg viewBox="0 0 320 200" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
          <line x1="20" y1="185" x2="300" y2="185" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
          
          {/* Flat Bench */}
          <line x1="80" y1="185" x2="80" y2="135" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
          <line x1="240" y1="185" x2="240" y2="135" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
          <line x1="60" y1="135" x2="260" y2="135" stroke="#334155" strokeWidth="12" strokeLinecap="round" />

          {/* Body on flat bench */}
          <path d="M90 126 L230 126" stroke="#FDA4AF" strokeWidth="14" strokeLinecap="round" />
          {/* Head */}
          <circle cx="242" cy="122" r="13" fill="#F43F5E" />

          {/* Pressing Dumbbell */}
          <motion.g
            animate={{ y: [12, -14, 12] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Arms */}
            <path d="M165 120 L165 80 L165 48" stroke="#FDA4AF" strokeWidth="8" strokeLinecap="round" />
            <rect x="145" y="44" width="40" height="8" rx="3" fill="#1E293B" />
            <circle cx="145" cy="48" r="9" fill={isNeutralGrip ? "#00D09C" : "#00D09C"} />
            <circle cx="185" cy="48" r="9" fill={isNeutralGrip ? "#00D09C" : "#00D09C"} />
          </motion.g>

          {/* Blue Trajectory Arrow */}
          <motion.path
            d="M 165 95 L 165 30"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
            fill="none"
            animate={{ strokeDashoffset: [0, -16] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          />
          <polygon points="165,22 171,32 159,32" fill="#38BDF8" />
        </svg>
      </div>
    );
  }

  // 3. 側平舉 (Lateral Raise)
  if (normId.includes('lateral')) {
    return (
      <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
        <svg viewBox="0 0 320 200" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
          <line x1="40" y1="185" x2="280" y2="185" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
          
          {/* Torso & Legs Standing */}
          <line x1="160" y1="185" x2="160" y2="135" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
          <line x1="160" y1="135" x2="160" y2="70" stroke="#FDA4AF" strokeWidth="14" strokeLinecap="round" />
          <circle cx="160" cy="52" r="14" fill="#F43F5E" />

          {/* Left & Right Arms Raising */}
          <motion.g
            animate={{ rotate: [-20, 15, -20] }}
            style={{ transformOrigin: '160px 75px' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Left Arm */}
            <path d="M155 75 L115 95 L80 100" stroke="#FDA4AF" strokeWidth="7" strokeLinecap="round" />
            <circle cx="75" cy="100" r="7" fill="#00D09C" />
          </motion.g>

          <motion.g
            animate={{ rotate: [20, -15, 20] }}
            style={{ transformOrigin: '160px 75px' }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Right Arm */}
            <path d="M165 75 L205 95 L240 100" stroke="#FDA4AF" strokeWidth="7" strokeLinecap="round" />
            <circle cx="245" cy="100" r="7" fill="#00D09C" />
          </motion.g>

          {/* Arc Blue Motion Trajectory Arrows */}
          <path d="M 75 140 Q 60 100 80 75" stroke="#38BDF8" strokeWidth="3.5" strokeDasharray="4 4" fill="none" />
          <polygon points="80,75 75,85 87,83" fill="#38BDF8" />

          <path d="M 245 140 Q 260 100 240 75" stroke="#38BDF8" strokeWidth="3.5" strokeDasharray="4 4" fill="none" />
          <polygon points="240,75 233,83 245,85" fill="#38BDF8" />
        </svg>
      </div>
    );
  }

  // 4. 跪姿屈膝抬腿 (Donkey Kicks - Exact match to Screen 3 in user image!)
  if (normId.includes('donkey') || normId.includes('kick') || normId.includes('leg_raise') || normId.includes('跪姿')) {
    return (
      <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
        <svg viewBox="0 0 320 200" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
          {/* Mat */}
          <rect x="50" y="155" width="220" height="8" rx="4" fill="#BAE6FD" />
          
          {/* Arms supporting */}
          <path d="M110 155 L110 105" stroke="#FDA4AF" strokeWidth="8" strokeLinecap="round" />
          <circle cx="110" cy="155" r="4" fill="#FDA4AF" />
          
          {/* Torso horizontal */}
          <path d="M110 105 L175 105" stroke="#FDA4AF" strokeWidth="12" strokeLinecap="round" />
          {/* Head & Ponytail */}
          <circle cx="95" cy="95" r="12" fill="#F43F5E" />
          <path d="M88 95 C 75 90, 72 105, 80 110" stroke="#7C2D12" strokeWidth="4" fill="none" />

          {/* Left knee resting on mat */}
          <path d="M175 105 L175 155" stroke="#0284C7" strokeWidth="9" strokeLinecap="round" />

          {/* Raising Leg with Cyan Arc Arrow */}
          <motion.g
            animate={{ rotate: [-10, 18, -10] }}
            style={{ transformOrigin: '175px 105px' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Thigh horizontal up, lower leg 90 deg up */}
            <path d="M175 105 L215 95 L220 55" stroke="#0284C7" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            {/* Sneaker */}
            <rect x="212" y="48" width="16" height="8" rx="3" fill="#EC4899" />
          </motion.g>

          {/* Signature Arc Arrow pointing upward */}
          <path d="M 210 130 Q 235 105 230 65" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" fill="none" />
          <polygon points="230,60 223,72 235,72" fill="#38BDF8" />
        </svg>
      </div>
    );
  }

  // 5. Default / Machine / Arms (Clean Minimalist Vector)
  return (
    <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
      <svg viewBox="0 0 320 200" className="w-full h-full max-h-52 drop-shadow-sm" fill="none">
        <line x1="30" y1="185" x2="290" y2="185" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
        
        {/* Bench / Seat */}
        <rect x="135" y="110" width="50" height="75" rx="5" fill="#334155" />
        <rect x="145" y="70" width="30" height="50" rx="4" fill="#475569" />

        {/* Athlete */}
        <circle cx="160" cy="50" r="14" fill="#F43F5E" />
        <path d="M160 65 L160 120" stroke="#FDA4AF" strokeWidth="12" strokeLinecap="round" />

        <motion.g
          animate={{ y: [6, -10, 6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Arms holding dumbbell/handle */}
          <path d="M140 85 L120 70 L120 38" stroke="#FDA4AF" strokeWidth="7" strokeLinecap="round" />
          <path d="M180 85 L200 70 L200 38" stroke="#FDA4AF" strokeWidth="7" strokeLinecap="round" />
          <circle cx="120" cy="38" r="8" fill="#00D09C" />
          <circle cx="200" cy="38" r="8" fill="#00D09C" />
        </motion.g>

        {/* Upward Blue Trajectory Arrow */}
        <path d="M 200 65 L 200 25" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
        <polygon points="200,20 205,28 195,28" fill="#38BDF8" />
      </svg>
    </div>
  );
}
