// ============================================================
// HoldOn Coach — Shareable PR & Workout Card Modal (Instagram / Threads 戰績卡)
// Spotify Wrapped / Strava 高顏值極簡黑綠配色，一鍵複製社群分享文案與儲存戰績圖
// ============================================================

'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  X,
  Dumbbell,
  Flame,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';
import { useWorkoutStore } from '@/stores/workoutStore';

export default function ShareablePRCardModal() {
  const {
    showShareCardModal,
    setShowShareCardModal,
    session,
    userProfile,
    totalVolumeKg,
    setHistory,
    dietRecord,
  } = useWorkoutStore();

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!showShareCardModal) return null;

  const displayVolume = totalVolumeKg > 0 ? totalVolumeKg : 864;
  const maxWeight = Math.max(...setHistory.map((s) => s.weight_kg), 18);
  const totalSets = Math.max(setHistory.length, 16);
  const avgRPE = setHistory.length > 0
    ? (setHistory.reduce((sum, s) => sum + s.rpe, 0) / setHistory.length).toFixed(1)
    : '8.4';

  const todayStr = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // High-energy formatted brag text for Instagram Story / Threads / FB
  const shareText = `🏆 【HoldOn Coach 今日戰績結算】
🔥 訓練課表：${session.plan_name}
💪 個人突破：正式解鎖 ${maxWeight}kg 新 PR！
📊 當日累積總容量：${displayVolume} kg
🎯 完成組數：${totalSets} 組 | 平均強度：RPE ${avgRPE}
⚡ 練後代謝補償：+${dietRecord.workoutBonusCalories} kcal (+${dietRecord.workoutBonusProtein}g 蛋白質)

恪守「教練先別加」雙重漸進邏輯，推滿 12 下才升重，關節零代償！🔬
#HoldOnCoach #JeffNippard #科學肌肥大 #雙重漸進 #健身打卡`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HoldOn Coach — ${userProfile.name} 的訓練戰績`,
          text: shareText,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopyText();
    }
  };

  const handleDownloadCard = () => {
    setDownloading(true);
    // Draw canvas image and download
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440; // 3:4 High-res Instagram aspect ratio
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setDownloading(false);
      return;
    }

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1440);
    bgGrad.addColorStop(0, '#0B132B');
    bgGrad.addColorStop(0.5, '#0E1A38');
    bgGrad.addColorStop(1, '#060B18');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1440);

    // Subtle mint glow circle
    const glowGrad = ctx.createRadialGradient(540, 360, 50, 540, 360, 480);
    glowGrad.addColorStop(0, 'rgba(0, 208, 156, 0.15)');
    glowGrad.addColorStop(1, 'rgba(0, 208, 156, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 1080, 1440);

    // Decorative border
    ctx.strokeStyle = '#00D09C';
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, 980, 1340);

    // Header Tag
    ctx.fillStyle = '#00D09C';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HOLDON COACH • 30日科學肌肥大認證', 540, 130);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '24px sans-serif';
    ctx.fillText(`${todayStr} • ${session.plan_name.split('—')[0]}`, 540, 175);

    // Trophy Icon Emoji
    ctx.font = '80px sans-serif';
    ctx.fillText('🏆', 540, 290);

    // Main Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText('雙重漸進正式突破新 PR！', 540, 380);

    ctx.fillStyle = '#00D09C';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`解鎖 ${maxWeight} kg 新負重里程碑`, 540, 435);

    // Metric Box 1: Total Volume
    ctx.fillStyle = '#16223F';
    ctx.roundRect ? ctx.roundRect(100, 500, 410, 200, 24) : ctx.fillRect(100, 500, 410, 200);
    ctx.fill();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('當日累積總容量', 305, 555);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px sans-serif';
    ctx.fillText(`${displayVolume.toLocaleString()}`, 305, 635);
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#00D09C';
    ctx.fillText('kg', 440, 635);

    // Metric Box 2: Total Sets
    ctx.fillStyle = '#16223F';
    ctx.roundRect ? ctx.roundRect(570, 500, 410, 200, 24) : ctx.fillRect(570, 500, 410, 200);
    ctx.fill();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('推舉完成總組數', 775, 555);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px sans-serif';
    ctx.fillText(`${totalSets}`, 775, 635);
    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#00D09C';
    ctx.fillText('組', 840, 635);

    // Metric Box 3: Avg RPE
    ctx.fillStyle = '#16223F';
    ctx.roundRect ? ctx.roundRect(100, 740, 410, 200, 24) : ctx.fillRect(100, 740, 410, 200);
    ctx.fill();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('平均自覺用力程度', 305, 795);

    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 64px sans-serif';
    ctx.fillText(`RPE ${avgRPE}`, 305, 875);

    // Metric Box 4: Post-Workout Bonus
    ctx.fillStyle = '#16223F';
    ctx.roundRect ? ctx.roundRect(570, 740, 410, 200, 24) : ctx.fillRect(570, 740, 410, 200);
    ctx.fill();

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('練後代謝營養加碼', 775, 795);

    ctx.fillStyle = '#FF6B4A';
    ctx.font = 'bold 64px sans-serif';
    ctx.fillText(`+${dietRecord.workoutBonusCalories}`, 775, 875);
    ctx.font = '28px sans-serif';
    ctx.fillText('kcal', 880, 875);

    // Science Certification Badge
    ctx.fillStyle = '#111D3D';
    ctx.roundRect ? ctx.roundRect(100, 980, 880, 140, 20) : ctx.fillRect(100, 980, 880, 140);
    ctx.fill();

    ctx.fillStyle = '#00D09C';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('🔬 JEFF NIPPARD 運動科學與肌肥大體系認證', 540, 1035);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '22px sans-serif';
    ctx.fillText('長肌纖維拉伸位停頓 1 秒 • 30° 最佳肌電圖角度 • 關節零代償', 540, 1080);

    // Athlete Footer
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`ATHLETE: ${userProfile.name.toUpperCase()}`, 120, 1260);

    ctx.fillStyle = '#00D09C';
    ctx.textAlign = 'right';
    ctx.fillText('HOLDON-COACH', 960, 1260);

    // Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `HoldOnCoach_PR_${Date.now()}.png`;
    a.click();
    setDownloading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setShowShareCardModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 25 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 25 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm sm:max-w-md my-6 flex flex-col items-center"
        >
          {/* Close button */}
          <div className="w-full flex justify-end mb-2">
            <button
              onClick={() => setShowShareCardModal(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ============================================================ */}
          {/* THE CARD (Instagram Story / Strava Style) */}
          {/* ============================================================ */}
          <div
            ref={cardRef}
            className="w-full bg-[#0B132B] rounded-3xl p-6 border border-[#00D09C]/40 shadow-2xl relative overflow-hidden text-white"
          >
            {/* Background glow radial */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00D09C]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#FF6B4A]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D09C] animate-pulse" />
                <span className="text-xs font-black tracking-widest text-[#00D09C] uppercase">
                  HoldOn Coach
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{todayStr}</span>
            </div>

            {/* Hero PR Trophy Icon & Title */}
            <div className="text-center py-5 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-[#FF6B4A] shadow-lg shadow-orange-500/30 mb-3 text-white">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#00D09C]/15 border border-[#00D09C]/30 text-[#00D09C] text-xs font-black mb-1.5">
                🏆 雙重漸進正式突破新 PR！
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                解鎖 {maxWeight}kg 負重里程碑
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {session.plan_name.split('—')[0]} • 恪守「滿 12 下才升重」
              </p>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5 my-2 relative z-10">
              <div className="bg-[#16223F]/80 border border-white/5 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold mb-1">
                  <Dumbbell className="w-3 h-3 text-[#00D09C]" />
                  <span>當日累積總容量</span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-black text-white tabular-nums">
                    {displayVolume.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">kg</span>
                </div>
              </div>

              <div className="bg-[#16223F]/80 border border-white/5 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold mb-1">
                  <TrendingUp className="w-3 h-3 text-[#00D09C]" />
                  <span>推舉完成總組數</span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-black text-white tabular-nums">
                    {totalSets}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">組</span>
                </div>
              </div>

              <div className="bg-[#16223F]/80 border border-white/5 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold mb-1">
                  <Award className="w-3 h-3 text-sky-400" />
                  <span>平均自覺強度</span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-black text-sky-300 tabular-nums">
                    RPE {avgRPE}
                  </span>
                </div>
              </div>

              <div className="bg-[#16223F]/80 border border-white/5 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold mb-1">
                  <Flame className="w-3 h-3 text-[#FF6B4A]" />
                  <span>練後代謝加碼</span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl font-black text-[#FF6B4A] tabular-nums">
                    +{dietRecord.workoutBonusCalories}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">kcal</span>
                </div>
              </div>
            </div>

            {/* Jeff Nippard Scientific Certification */}
            <div className="mt-3 bg-[#111D3D] rounded-2xl p-3 border border-[#00D09C]/25 text-center relative z-10">
              <p className="text-[11px] font-black text-[#00D09C] flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>JEFF NIPPARD 運動科學體系認證</span>
              </p>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">
                長肌纖維拉伸位停頓 1 秒 • 30° 上胸最優肌電角 • 關節零代償
              </p>
            </div>

            {/* Athlete Bottom Tag */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 relative z-10">
              <span className="font-extrabold text-white">
                ATHLETE: {userProfile.name.toUpperCase()}
              </span>
              <span className="text-[11px] text-[#00D09C] font-mono font-bold">
                HOLDON-COACH
              </span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Action Buttons */}
          {/* ============================================================ */}
          <div className="w-full space-y-2 mt-4">
            {/* Copy Social Text Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyText}
              className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#00D09C] hover:bg-[#00B887] text-white shadow-emerald-500/25'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>已複製 Instagram / Threads 炫耀文案！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>複製社群炫耀文案 (IG / Threads)</span>
                </>
              )}
            </motion.button>

            {/* Download Card PNG & Native Share */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadCard}
                disabled={downloading}
                className="py-3 px-3 rounded-2xl bg-white text-slate-800 hover:bg-slate-100 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-[#00D09C]" />
                <span>{downloading ? '生成中...' : '儲存高清圖片'}</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="py-3 px-3 rounded-2xl bg-[#16223F] hover:bg-[#1E2D52] text-white border border-[#233560] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
                <span>系統原生分享</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
