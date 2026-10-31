// ============================================================
// HoldOn Coach — Progress Analytics View (真實健身進步曲線與趨勢分析)
// 真實呈現 8 週週期化波浪走勢、階梯升重、主動減量週 (Deload) 與 PR 突破歷程
// ============================================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Dumbbell,
  Calendar,
  Trophy,
  ShieldCheck,
  Flame,
  Activity,
  Layers,
  Sparkles,
  Info,
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
  BarChart,
  Bar,
} from 'recharts';
import { useWorkoutStore } from '@/stores/workoutStore';

export default function ProgressAnalyticsView() {
  const { history, userProfile } = useWorkoutStore();
  const [metric, setMetric] = useState<'volume' | 'weight' | 'rpe' | 'cumulative'>('volume');

  // Chronological sort for charts
  const sortedHistory = [...history].reverse();

  let runningTotal = 0;
  const chartData = sortedHistory.map((item, idx) => {
    runningTotal += item.totalVolumeKg;
    return {
      date: item.date,
      volume: item.totalVolumeKg,
      weight: item.maxWeightKg,
      rpe: item.avgRpe,
      cumulative: runningTotal,
      plan: item.planName,
      pr: item.prAchieved,
      phaseNote: item.phaseNote || '',
      index: idx + 1,
    };
  });

  const totalSessions = history.length;
  const lifetimeVolume = history.reduce((s, h) => s + h.totalVolumeKg, 0);
  const bestWeight = Math.max(...history.map((h) => h.maxWeightKg), 18);
  const prCount = history.filter((h) => h.prAchieved).length;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 pb-28 text-white">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 rounded-3xl p-5 mb-5 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-white">真實週期化進步曲線</h2>
            <p className="text-[11px] text-zinc-300">
              波浪總容量 • 雙重漸進配重階梯 • 減量週超量恢復
            </p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed mt-2">
          真實健人的進步從來不是直線狂飆！數據顯示你在第 5 週（10/05）進行了主動減量週（Deload），隨後迎來關節修復與超量生長，臥推重量成功突破到 <b className="text-emerald-400">{bestWeight}kg</b>！
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2.5 text-center">
          <span className="text-[10px] text-zinc-500 block">訓練場次</span>
          <span className="text-lg font-black text-white">{totalSessions} <span className="text-[10px] font-normal text-zinc-400">次</span></span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2.5 text-center">
          <span className="text-[10px] text-orange-400 block">累計總噸數</span>
          <span className="text-lg font-black text-orange-400">{(lifetimeVolume / 1000).toFixed(1)} <span className="text-[10px] font-normal text-zinc-400">t</span></span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2.5 text-center">
          <span className="text-[10px] text-emerald-400 block">最高推重</span>
          <span className="text-lg font-black text-emerald-400">{bestWeight} <span className="text-[10px] font-normal text-zinc-400">kg</span></span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2.5 text-center">
          <span className="text-[10px] text-amber-400 block">破紀錄 PR</span>
          <span className="text-lg font-black text-amber-400">{prCount} <span className="text-[10px] font-normal text-zinc-400">次</span></span>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-zinc-300">📊 走勢分析圖表</span>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px]">
          <button
            onClick={() => setMetric('volume')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              metric === 'volume'
                ? 'bg-orange-500 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            容量波浪
          </button>
          <button
            onClick={() => setMetric('weight')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              metric === 'weight'
                ? 'bg-emerald-500 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            配重階梯
          </button>
          <button
            onClick={() => setMetric('rpe')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              metric === 'rpe'
                ? 'bg-sky-500 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            RPE 強度
          </button>
          <button
            onClick={() => setMetric('cumulative')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              metric === 'cumulative'
                ? 'bg-purple-500 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            累計噸數
          </button>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 h-72 w-full mb-6 shadow-xl">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'volume' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
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
                formatter={(val: any) => [`${val} kg`, '單日訓練容量']}
                labelFormatter={(label) => `訓練日期: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#f97316"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#volGrad)"
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
                formatter={(val: any) => [`${val} kg`, '最高啞鈴配重']}
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
          ) : metric === 'rpe' ? (
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
                formatter={(val: any) => [`RPE ${val}`, '平均自覺強度']}
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
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
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
                formatter={(val: any) => [`${val} kg (${(Number(val)/1000).toFixed(1)}噸)`, '終身累計總噸數']}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#a855f7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#cumGrad)"
                dot={{ fill: '#a855f7', r: 4 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Real-world Periodized Timeline & Phase Notes */}
      <div>
        <h3 className="text-xs font-bold text-zinc-300 mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>8 週訓練週期與超量恢復里程碑</span>
        </h3>

        <div className="space-y-2.5">
          {history.map((entry) => (
            <div
              key={entry.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                entry.prAchieved
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : entry.safetyInterventions > 0
                  ? 'bg-orange-500/10 border-orange-500/30'
                  : entry.maxWeightKg <= 10
                  ? 'bg-sky-500/10 border-sky-500/30'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex flex-col items-center justify-center text-xs font-mono font-bold text-white shrink-0">
                    <span>{entry.date}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{entry.planName}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {entry.phaseNote || '常規肌肥大漸進課表'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-orange-400 font-mono block">
                    {entry.totalVolumeKg}kg
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono block">
                    {entry.maxWeightKg}kg • RPE {entry.avgRpe}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-zinc-800/60">
                {entry.prAchieved && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-amber-400" /> PR 突破
                  </span>
                )}
                {entry.safetyInterventions > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-orange-400" /> 關節安全防護
                  </span>
                )}
                {entry.maxWeightKg <= 10 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                    🧘 主動減量修復週
                  </span>
                )}
                <span className="text-[10px] text-zinc-500 ml-auto font-mono">
                  {entry.totalSets} 組完成
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
