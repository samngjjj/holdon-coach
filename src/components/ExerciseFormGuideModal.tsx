// ============================================================
// HoldOn Coach — Exercise Form Guide Modal (動作詳解與標準發力指南)
// 徹底解決「看不懂動作點做」：分步分解、常犯錯誤、發力肌群與關節防護
// ============================================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';
import ExerciseIllustration from './ExerciseIllustration';

interface ExerciseFormGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: string;
  exerciseName: string;
  gripType: string;
  cue: string;
  isNeutralGrip?: boolean;
}

interface GuideContent {
  targetMuscle: string;
  secondaryMuscles: string;
  steps: { title: string; desc: string; tip: string }[];
  mistakes: { mistake: string; danger: string; fix: string }[];
  tempo: string;
  jointSafety: string;
}

// 根據動作 ID 或名稱匹配專業發力指南
function getExerciseGuide(id: string, name: string): GuideContent {
  const norm = (id + ' ' + name).toLowerCase();

  if (norm.includes('incline') && (norm.includes('press') || norm.includes('推'))) {
    return {
      targetMuscle: '胸大肌上束（鎖骨頭 Clavicular Head）',
      secondaryMuscles: '三角肌前束、肱三頭肌、前鋸肌',
      tempo: '離心下放 2~3 秒 ➔ 底部拉伸停頓 0.5 秒 ➔ 爆發推起 1 秒 ➔ 頂峰收縮 1 秒',
      jointSafety: '手肘與身體夾角嚴禁呈 90° 直角（易引發肩峰夾擠與旋轉肌撕裂），應維持 45°~60° 自然內收。',
      steps: [
        {
          title: '步驟 1：調整斜板與起始姿態',
          desc: '將臥推椅角度調整為 30 度（過高如 45 度以上會讓前三角肌過度代償）。雙腳完全踩實地面，臀部與上背緊貼椅背，沉肩、向後下方收緊肩胛骨。',
          tip: '核心收緊，下背自然微拱（約留一手掌厚度），切勿過度反弓腰椎借力。',
        },
        {
          title: '步驟 2：離心下放（充分拉伸）',
          desc: '吸氣，慢速控制啞鈴下沉 2~3 秒。前臂全程保持垂直於地面，手肘與軀幹呈約 45°~60° 夾角，下放至啞鈴靠近上胸外側，感受上胸肌纖維被深層拉伸。',
          tip: '底部不要依靠彈震推起，在此停頓 0.5 秒消除慣性。',
        },
        {
          title: '步驟 3：向心推起（頂峰收縮）',
          desc: '吐氣，意念集中在上胸發力，沿著胸肌纖維走向將啞鈴向上、微向內推起至鎖骨上方。推至最高點時啞鈴互不碰撞，手肘微曲不鎖死。',
          tip: '頂峰維持 1 秒意念夾胸，保持胸肌持續高張力。',
        },
      ],
      mistakes: [
        {
          mistake: '手肘呈 90 度完全向外展水平推舉',
          danger: '肩關節囊承受極大剪切力，肩袖肌群易發炎或撕裂。',
          fix: '手肘向內收進約 45°~60°，沉肩收胛，用胸肌發力推起。',
        },
        {
          mistake: '推到最高點手肘完全打直鎖死（Lockout）',
          danger: '胸肌張力完全中斷，重量直接壓迫肘關節與肩關節。',
          fix: '最高點保持 5° 微彎曲，專注胸肌內夾發力。',
        },
        {
          mistake: '手腕向後過度塌陷無支撐',
          danger: '手腕韌帶受壓過重，極易引發手腕扭傷或腱鞘炎。',
          fix: '手腕中立筆直，讓啞鈴重力直接通過前臂骨骼力線。',
        },
      ],
    };
  }

  if (norm.includes('flat') && (norm.includes('press') || norm.includes('推'))) {
    return {
      targetMuscle: '胸大肌中束與整體厚度（Sternocostal Head）',
      secondaryMuscles: '肱三頭肌、三角肌前束',
      tempo: '離心慢放 2 秒 ➔ 底部胸口停頓 0.5 秒 ➔ 向心爆發推起 1 秒',
      jointSafety: '沉肩收胛貼死椅面，手腕垂直於手肘正上方。',
      steps: [
        {
          title: '步驟 1：仰臥穩定與腳底驅動',
          desc: '仰臥於平板臥推椅，雙腳全腳掌踩實地面（Leg Drive），頭、上背、臀部三點貼實，肩胛骨向後收攏下沉。',
          tip: '握緊啞鈴，手腕保持中立挺直。',
        },
        {
          title: '步驟 2：離心下放至乳頭兩側',
          desc: '吸氣緩慢下放啞鈴至胸大肌中段高度，手肘呈 60° 左右內收，胸肌充分水平拉伸。',
          tip: '下放時保持胸腔充氣擴張。',
        },
        {
          title: '步驟 3：胸肌夾擠推起',
          desc: '吐氣向上推至胸口正上方，頂端想像胸大肌向中線擠壓，肘不完全鎖死。',
          tip: '推起時肩膀始終固定在板凳上，切勿聳肩向前送肩。',
        },
      ],
      mistakes: [
        {
          mistake: '推起時肩膀向前伸（Protraction），聳肩離凳',
          danger: '胸肌張力轉移到前三角肌，引發肩峰撞擊。',
          fix: '肩胛骨全程釘在板凳上，只動手臂關節。',
        },
        {
          mistake: '下放幅度太淺或藉助胸骨反彈',
          danger: '拉伸肌肥大刺激不足，或挫傷胸骨軟組織。',
          fix: '全程受控下放至胸口兩側，停頓 0.5 秒再推起。',
        },
      ],
    };
  }

  if (norm.includes('lateral') || norm.includes('側平舉')) {
    return {
      targetMuscle: '三角肌中束（Lateral Deltoid — 打造寬肩膀關鍵）',
      secondaryMuscles: '斜方肌上束（代償肌，需抑制）、前鋸肌',
      tempo: '向上抬起 1 秒 ➔ 頂峰停頓 1 秒 ➔ 離心慢放 2.5 秒',
      jointSafety: '在肩胛骨平面（Scapular Plane，身體前方約 20°-30°）進行，切勿完全在身體正側面發力。',
      steps: [
        {
          title: '步驟 1：站姿與握持準備',
          desc: '雙腳與肩同寬，膝蓋微屈，上半身自然前傾 10~15 度。雙手握啞鈴置於身體前方大腿兩側，手肘微屈約 15 度鎖定。',
          tip: '沉肩！想像將肩膀遠離耳朵，完全抑制斜方肌發力。',
        },
        {
          title: '步驟 2：手肘引導向側前方抬起',
          desc: '以手肘為引導（想像手肘有一根繩子往側上方拉），沿著側前方 30 度弧線抬起至與肩膀水平同高。',
          tip: '手掌朝下或小拇指微高於大拇指，小重量重控制。',
        },
        {
          title: '步驟 3：頂峰停頓與慢速下放',
          desc: '在最高點維持 1 秒頂峰收縮，隨後用 2.5 秒慢速離心放回，始終維持中束張力。',
          tip: '下放時不要讓啞鈴完全碰在一起放鬆。',
        },
      ],
      mistakes: [
        {
          mistake: '用大重量聳肩甩動借力（Shrugging）',
          danger: '肩膀練不寬，反而讓斜方肌肥厚、脖子粗短。',
          fix: '果斷降重！意念放在手肘向外延展推開。',
        },
        {
          mistake: '手腕高於手肘抬起',
          danger: '力量轉移至前束與前臂，中束完全得不到刺激。',
          fix: '始終保持手肘微高於或平行於手腕。',
        },
      ],
    };
  }

  if (norm.includes('machine') || norm.includes('機械')) {
    return {
      targetMuscle: '胸大肌整體（固定安全軌跡孤立刺激）',
      secondaryMuscles: '肱三頭肌、三角肌前束',
      tempo: '離心慢放 2.5 秒 ➔ 向心平穩推滿 1 秒 ➔ 頂峰收縮 1 秒',
      jointSafety: '調整座椅高度使握把中心對準胸口中下部，手肘與握把在同一水平推進面。',
      steps: [
        {
          title: '步驟 1：座椅與握把高度調節',
          desc: '調整座椅高度，坐在椅上時握把把手應剛好位於胸大肌乳頭水平線。上背緊貼靠背，沉肩夾背。',
          tip: '若肩膀有痛感，請選用垂直的對握把手（中立握法）。',
        },
        {
          title: '步驟 2：向前推滿與收縮',
          desc: '吐氣向前平穩推起握把，直到雙臂伸展，頂峰保持 1 秒胸肌等長擠壓。',
          tip: '手肘微曲不鎖死。',
        },
        {
          title: '步驟 3：慢速後退拉伸',
          desc: '吸氣抵抗配重片阻力，用 2~3 秒慢速退回，讓胸肌充分水平拉伸，避免配重塊完全砸下。',
          tip: '全程維持肩膀貼緊椅背。',
        },
      ],
      mistakes: [
        {
          mistake: '座椅太低，握把高於肩膀推舉',
          danger: '肩膀極度內旋代償，容易引起關節囊夾擠。',
          fix: '調高座椅，讓把手高度維持在胸口中線。',
        },
      ],
    };
  }

  // 預設通用動作指南
  return {
    targetMuscle: '目標肌群深層機械張力',
    secondaryMuscles: '協同肌群與核心穩定鏈',
    tempo: '離心控制 2 秒 ➔ 頂峰收縮 1 秒 ➔ 呼吸自然流暢',
    jointSafety: '維持關節中立位，避免關節極限角度過度鎖死，全程靠肌肉張力控制負載。',
    steps: [
      {
        title: '步驟 1：動作準備與核心收緊',
        desc: '維持脊椎中立位，核心收緊建立腹內壓，穩固支撐底座。',
        tip: '沉肩放鬆頸部，避免代償。',
      },
      {
        title: '步驟 2：離心拉伸階段',
        desc: '吸氣受控下放，動作節奏維持 2~3 秒慢速，感受目標肌纖維被充分拉伸。',
        tip: '不借慣性下墜。',
      },
      {
        title: '步驟 3：向心發力推起/拉引',
        desc: '吐氣，目標肌群主動收縮發力，推/拉至頂峰位置停頓 1 秒。',
        tip: '關節微曲不鎖死。',
      },
    ],
    mistakes: [
      {
        mistake: '動作速度太快，依靠慣性擺盪',
        danger: '機械張力驟降，關節軟組織承壓過大。',
        fix: '放慢速度，把重心放在離心控制與肌肉收縮感。',
      },
    ],
  };
}

export default function ExerciseFormGuideModal({
  isOpen,
  onClose,
  exerciseId,
  exerciseName,
  gripType,
  cue,
  isNeutralGrip = false,
}: ExerciseFormGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'steps' | 'mistakes' | 'anatomy'>('steps');
  const guide = getExerciseGuide(exerciseId, exerciseName);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 32 }}
          className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00D09C]/15 text-[#00A87E]">
                  標準動作發力教學
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {gripType}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {exerciseName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
            {/* Visual Movement Area */}
            <div className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden relative">
              <ExerciseIllustration
                exerciseId={exerciseId}
                exerciseName={exerciseName}
                isNeutralGrip={isNeutralGrip}
                className="w-full h-full"
              />
            </div>

            {/* Quick Coach Cue Banner */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#00A87E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-emerald-950">教練口訣：</span>
                <p className="text-[11px] font-medium leading-relaxed mt-0.5">
                  {cue}
                </p>
              </div>
            </div>

            {/* Three Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('steps')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'steps' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500'
                }`}
              >
                ① 分步動作拆解
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mistakes')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'mistakes' ? 'bg-white text-rose-700 shadow-2xs font-black' : 'text-slate-500'
                }`}
              >
                ⚠️ 常見錯誤預防
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('anatomy')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'anatomy' ? 'bg-white text-slate-900 shadow-2xs font-black' : 'text-slate-500'
                }`}
              >
                🎯 肌群與節奏
              </button>
            </div>

            {/* Tab 1: Steps */}
            {activeTab === 'steps' && (
              <div className="space-y-3">
                {guide.steps.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                      <span className="w-5 h-5 rounded-full bg-[#00D09C] text-white flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{s.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-6 text-[11px]">
                      {s.desc}
                    </p>
                    <div className="ml-6 mt-1 p-2 bg-white rounded-lg border border-slate-200 text-slate-500 text-[10px] font-medium flex items-center gap-1.5">
                      <Info className="w-3 h-3 text-[#00A87E] shrink-0" />
                      <span>{s.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Mistakes */}
            {activeTab === 'mistakes' && (
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <b>🛡️ 關節防護提醒：</b>
                  <p className="mt-0.5">{guide.jointSafety}</p>
                </div>

                {guide.mistakes.map((m, idx) => (
                  <div key={idx} className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-black text-rose-900 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{m.mistake}</span>
                    </div>
                    <p className="text-rose-700 text-[11px] pl-5.5">
                      💥 潛在受傷風險：{m.danger}
                    </p>
                    <div className="ml-5.5 p-2 bg-white rounded-lg border border-rose-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>正確糾正：{m.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Anatomy & Tempo */}
            {activeTab === 'anatomy' && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                      🎯 主要發力肌群 (Target Muscle)
                    </span>
                    <span className="text-sm font-black text-emerald-700">
                      {guide.targetMuscle}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5">
                      🛡️ 協同與穩定肌群 (Secondary Muscles)
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {guide.secondaryMuscles}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">
                    ⏱️ 黃金動作節奏 (Tempo)
                  </span>
                  <p className="text-xs font-black text-slate-900">
                    {guide.tempo}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#00D09C] hover:bg-[#00B98A] text-white text-xs font-black transition-all shadow-xs cursor-pointer active:scale-98"
            >
              我知道了，開始標準做組 💪
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
