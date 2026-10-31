// ============================================================
// HoldOn Coach — History Modal & Progress Line Chart (訓練歷史與趨勢折線圖)
// 呈現真實 8 週週期化波浪走勢、階梯升重、主動減量週 (Deload) 與 PR 突破歷程
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Dumbbell,
  Calendar,
  Trophy,
  ShieldCheck,
  X,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { useWorkoutStore } from '@/stores/workoutStore';

export default function HistoryModal() {
  const { history, showHistoryModal, setShowHistoryModal } = useWorkoutStore();
  const [metric, setMetric] = useState<'volume' | 'weight' | 'rpe'>('volume');

  if (!showHistoryModal) return null;

  // Format data for chart (sorted chronologically)
  const chartData = [...history]
    .reverse()
    .map((item, index) => ({
      date: item.date,
      volume: item.totalVolumeKg,
      weight: item.maxWeightKg,
      rpe: item.avgRpe,
      plan: item.planName,
      pr: item.prAchieved,
      phaseNote: item.phaseNote || '',
      index: index + 1,
    }));

  const totalSessions = history.length;
  const bestVolume = Math.max(...history.map((h) => h.totalVolumeKg), 864);
  const bestWeight = Math.max(...history.map((h) => h.maxWeightKg), 18);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setShowHistoryModal(false)}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl my-8 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">訓練進步歷史與趨勢分析</h2>
                <p className="text-xs text-zinc-400">真實 8 週週期化波浪與雙重漸進配重階梯</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 pr-1 space-y-4 pt-3">
            {/* KPI Mini Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>累計訓練</span>
                </div>
                <p className="text-2xl font-black text-white">{totalSessions} <span className="text-xs font-normal text-zinc-400">次</span></p>
              </div>

              <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-orange-400 text-xs mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>最高單次容量</span>
                </div>
                <p className="text-2xl font-black text-orange-400">{bestVolume} <span className="text-xs font-normal text-zinc-400">kg</span></p>
              </div>

              <div className="bg-zinc-800/60 border border-zinc-700/40 rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs mb-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>最高推舉重量</span>
                </div>
                <p className="text-2xl font-black text-emerald-400">{bestWeight} <span className="text-xs font-normal text-zinc-400">kg</span></p>
              </div>
            </div>

            {/* Metric Selector Tabs */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300">📈 進步曲線走向</span>
              <div className="flex bg-zinc-800/80 p-1 rounded-xl border border-zinc-700/50">
                <button
                  onClick={() => setMetric('volume')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    metric === 'volume'
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  容量波浪
                </button>
                <button
                  onClick={() => setMetric('weight')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    metric === 'weight'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  配重階梯
                </button>
                <button
                  onClick={() => setMetric('rpe')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    metric === 'rpe'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  平均 RPE
                </button>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {metric === 'volume' ? (
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                      formatter={(val: any) => [`${val} kg`, '總訓練量']}
                      labelFormatter={(label) => `訓練日期: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorVolume)"
                      dot={{ fill: '#f97316', r: 4 }}
                      activeDot={{ r: 6, fill: '#fbbf24' }}
                    />
                  </AreaChart>
                ) : metric === 'weight' ? (
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} domain={[8, 22]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                      formatter={(val: any) => [`${val} kg`, '最高推舉配重']}
                    />
                    <Line
                      type="stepAfter"
                      dataKey="weight"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} domain={[6, 10]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#3f3f46',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                      formatter={(val: any) => [`RPE ${val}`, '自覺疲勞強度']}
                    />
                    <Line
                      type="monotone"
                      dataKey="rpe"
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={{ fill: '#38bdf8', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Historical Log Cards */}
            <div>
              <h3 className="text-xs font-bold text-zinc-300 mb-3 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>8 週真實週期與階段備註</span>
              </h3>
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-2xl border transition-colors ${
                      entry.prAchieved
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : entry.safetyInterventions > 0
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : 'bg-zinc-800/40 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex flex-col items-center justify-center text-xs font-mono text-zinc-400 shrink-0 font-bold">
                          <span className="text-white">{entry.date}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{entry.planName}</p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">{entry.phaseNote || '常規課表'}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-orange-400 font-mono block">
                          {entry.totalVolumeKg}kg
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono block">
                          {entry.maxWeightKg}kg • RPE {entry.avgRpe}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
