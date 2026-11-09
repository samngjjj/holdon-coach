// ============================================================
// HoldOn Coach — Progress Analytics View (Screen 5: 記錄您的進度 - Leap Fitness Exact Replica)
// 極簡白底卡片、體重平滑折線圖、BMI 分段色彩進度條與理想體重按鈕
// ============================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Dumbbell,
  Trophy,
  Calendar,
  Sparkles,
  Activity,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import { useWorkoutStore } from '@/stores/workoutStore';
import { calculateProfileStats } from '@/data/exercises';

export default function ProgressAnalyticsView() {
  const { history, userProfile, setShowProfileModal } = useWorkoutStore();
  const [metric, setMetric] = useState<'volume' | 'weight' | 'rpe'>('volume');

  const stats = calculateProfileStats(userProfile);

  // Weight progression data matching Screen 5 in the photo (Aug 9, Aug 15, Aug 21, Aug 27, etc.)
  const weightTrendData = [
    { date: 'Aug 9', lbs: 155.5, kg: 77.6 },
    { date: 'Aug 15', lbs: 152.0, kg: 76.0 },
    { date: 'Aug 21', lbs: 149.8, kg: 74.9 },
    { date: 'Aug 27', lbs: 147.5, kg: 74.0 },
  ];

  // 8-week undulating wave volume data
  const sortedHistory = [...history].reverse();
  const chartData = sortedHistory.map((item, idx) => ({
    date: item.date,
    volume: item.totalVolumeKg,
    weight: item.maxWeightKg,
    rpe: item.avgRpe,
    plan: item.planName,
    pr: item.prAchieved,
    index: idx + 1,
  }));

  const totalSessions = history.length;
  const lifetimeVolume = history.reduce((s, h) => s + h.totalVolumeKg, 0);
  const bestWeight = Math.max(...history.map((h) => h.maxWeightKg), 18);

  // BMI calculations & segmented pointer position
  const bmiVal = stats.bmi; // e.g. 23.9
  // Range: 15 to 35. Normalized percentage: (bmi - 15) / 20 * 100
  const bmiPct = Math.min(100, Math.max(0, ((bmiVal - 15) / 20) * 100));

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-28 text-slate-800">
      {/* 1. Screen 5 Replica Card: 體重 (Weight Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm mb-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-black text-slate-900">體重</h3>
          <span className="text-xs text-slate-400 font-medium">單位：磅 (lbs) / 公斤 (kg)</span>
        </div>

        {/* Current Weight & 30-Day Badge (Exact Screen 5 layout!) */}
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-xs text-slate-400 block font-medium">目前體重</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {userProfile.weight_kg ? (userProfile.weight_kg * 2.20462).toFixed(1) : '147.5'}
              </span>
              <span className="text-sm font-semibold text-slate-400">lbs</span>
              <span className="text-xs text-slate-400 font-mono ml-2">
                ({userProfile.weight_kg} kg)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">過去30天</span>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-[#00A87E]">
              -8.0 lbs (-3.6 kg)
            </span>
          </div>
        </div>

        {/* Smooth Minimalist Green Line Chart (Exact Screen 5 Style!) */}
        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D09C" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00D09C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[130, 160]}
                ticks={[130, 135, 140, 145, 150]}
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B132B',
                  borderRadius: '16px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
                formatter={(val: any) => [`${val} lbs`, '體重']}
              />
              <Area
                type="monotone"
                dataKey="lbs"
                stroke="#00D09C"
                strokeWidth={3}
                fill="url(#weightGrad)"
                dot={{ fill: '#00D09C', stroke: '#fff', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#00A87E' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2. Screen 5 Replica Card: BMI (kg/m²) Segmented Bar & '理想體重' Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm mb-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-black text-slate-900">
            BMI (kg/m²) : <span className="text-[#00A87E]">{bmiVal}</span>
            <span className="text-xs font-bold text-slate-500 ml-2">
              ({bmiVal < 18.5 ? '過輕' : bmiVal <= 24 ? '正常範圍' : bmiVal <= 27 ? '微過重' : '肥胖'})
            </span>
          </h3>
          <span className="text-xs text-slate-400">體脂 {userProfile.body_fat_pct || 16.5}%</span>
        </div>

        {/* Multi-Segmented Color Bar (Exact Screen 5 Style!) */}
        <div className="relative pt-3 pb-4">
          {/* Triangular Pointer Indicator */}
          <div
            className="absolute top-0 transition-all duration-700 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${bmiPct}%` }}
          >
            <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-md shadow-xs mb-0.5">
              {bmiVal}
            </span>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-slate-700" />
          </div>

          {/* 4 Colored Segments: Navy / Mint Green / Yellow / Red */}
          <div className="h-3 w-full rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full w-[25%] bg-[#1E3A8A]" title="過輕 (<18.5)" />
            <div className="h-full w-[35%] bg-[#00D09C]" title="正常 (18.5-24)" />
            <div className="h-full w-[20%] bg-[#EAB308]" title="過重 (24-27)" />
            <div className="h-full w-[20%] bg-[#EF4444]" title="肥胖 (>27)" />
          </div>

          {/* Legend Text */}
          <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1.5 px-0.5">
            <span>過輕</span>
            <span className="text-[#00A87E] font-bold">正常 (18.5-24)</span>
            <span>過重</span>
            <span>肥胖</span>
          </div>
        </div>

        {/* Solid Vibrant Blue Pill Button (Screen 5 Replica: '理想體重') */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowProfileModal(true)}
          className="w-full py-3.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-sm shadow-md shadow-sky-500/25 flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>理想體重 & 生理指標分析</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* 3. 8-Week Undulating Wave Progressive Overload Card (HoldOn Coach Core Science) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">8週真實週期化訓練量</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              含主動減量週 (Deload) 與 PR 破紀錄突破歷程
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#00A87E]">
            累計 {(lifetimeVolume / 1000).toFixed(1)} 噸
          </span>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
          <button
            onClick={() => setMetric('volume')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              metric === 'volume' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            總容量 (kg)
          </button>
          <button
            onClick={() => setMetric('weight')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              metric === 'weight' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            最高配重 (kg)
          </button>
          <button
            onClick={() => setMetric('rpe')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              metric === 'rpe' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            自覺強度 (RPE)
          </button>
        </div>

        {/* Volume / Progression Chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00D09C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00D09C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0B132B',
                  borderRadius: '16px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke="#00D09C"
                strokeWidth={3}
                fill="url(#volGrad)"
                dot={{ fill: '#00D09C', stroke: '#fff', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Scientific Progression Summary */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            最高握推突破：<b className="text-slate-900">{bestWeight}kg</b>
          </span>
          <span className="text-slate-500">
            完成場次：<b className="text-slate-900">{totalSessions} 次</b>
          </span>
          <span className="text-[#00A87E] font-bold">
            🏆 PR 突破 4 次
          </span>
        </div>
      </motion.div>
    </div>
  );
}
