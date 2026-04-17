'use client';
import { useState, useEffect, useRef } from 'react';
import { STORY_MATRIX } from '../../../config/story';
import { supabase } from '@/lib/supabase';

// 情绪稳定的打字机组件
const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (onComplete) onComplete();
      }
    }, 70); // 速度适中，不抽风

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text]);

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};

export default function DungeonPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState('intro');
  const [path, setPath] = useState({ q1: 0, q2: 0 });
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchDungeon = async () => {
      const { data: d } = await supabase.from('dungeons').select('*').eq('id', params.id).single();
      if (d) setData(d);
    };
    fetchDungeon();
  }, [params.id]);

  if (!data) return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f1f5f9]">
      <div className="text-xl font-bold text-slate-400">正在同步主神位面数据...</div>
    </div>
  );

  const matrix = STORY_MATRIX(data);

  return (
    // 最外层：强行全屏且绝对居中
    <main className="min-h-screen w-full bg-[#f1f5f9] flex items-center justify-center p-4 md:p-8">

      {/* 中间的实体卡片 */}
      <div className="bg-white max-w-2xl w-full border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0_#1e293b] p-8 md:p-12 flex flex-col transition-all duration-500">

        {/* 上半部分：打字机剧情展示区 */}
        <div className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed min-h-[180px]">
          {step === 'intro' && (
            <Typewriter
              text={`[ 状态检测 ]\n目标个体：${data.target_name}\n历史遗留：曾执行过【${data.lore}】\n结论：智力水平极具特色，建议加强监管。`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'q1' && (
            <Typewriter
              text={`现在你深处副本核心，手中只有唯一的道具：【${data.item}】。面对这种局面，你决定：`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'q2' && (
            <Typewriter
              text={`你刚才的行为让空气足足尴尬了 3 秒。现在，系统要求你进行下一步：`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'scene' && (
            <Typewriter
              text={`行为结果：\n${matrix.scenes[path.q1][path.q2].act}\n\n后果：\n${matrix.scenes[path.q1][path.q2].res}`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'boss' && (
            <Typewriter
              text={`!!! 警报 !!!\n【${data.fear_boss}】已被你的操作惊醒！\n它正准备对你执行惩罚：${data.fear_punish}`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'end' && (
            <div className="text-center animate-in fade-in duration-1000">
              <p className="text-lg text-slate-400 mb-6">[ 副本已湮灭。 ]</p>
              <p className="text-2xl font-black mb-10">“这是 ${data.creator_nick} 专门送给你的惊喜。”</p>
              <div className="bg-yellow-50 border-4 border-slate-900 p-8 rounded-2xl transform -rotate-2">
                <p className="text-2xl font-bold text-slate-800">“{data.final_message}”</p>
              </div>
            </div>
          )}
        </div>

        {/* 下半部分：操作与选项区 */}
        {showOptions && step !== 'end' && (
          // flex-col 和 gap-4 确保所有按钮垂直排列，不横向挤压
          <div className="flex flex-col gap-4 mt-8 animate-in slide-in-from-bottom-6 duration-700 w-full">

            {step === 'intro' && (
              <button onClick={() => {setStep('q1'); setShowOptions(false);}} className="w-full bg-blue-100 hover:bg-blue-200 border-4 border-slate-900 p-5 rounded-2xl font-bold text-2xl text-center transition-all active:translate-y-1">
                [ 接受试炼 ]
              </button>
            )}

            {step === 'q1' && matrix.q1.map((opt, i) => (
              <button key={i} onClick={() => {setPath({...path, q1: i}); setStep('q2'); setShowOptions(false);}} className="w-full text-left bg-slate-50 hover:bg-slate-100 border-2 border-slate-900 p-5 rounded-2xl font-bold text-lg md:text-xl transition-all active:translate-y-1">
                {String.fromCharCode(65 + i)}. {opt.text.replace("${data.item}", data.item).replace("${data.lore}", data.lore)}
              </button>
            ))}

            {step === 'q2' && matrix.q2[path.q1].map((opt, i) => (
              <button key={i} onClick={() => {setPath({...path, q2: i}); setStep('scene'); setShowOptions(false);}} className="w-full text-left bg-slate-50 hover:bg-slate-100 border-2 border-slate-900 p-5 rounded-2xl font-bold text-lg md:text-xl transition-all active:translate-y-1">
                {String.fromCharCode(65 + i)}. {opt.text.replace("${data.item}", data.item).replace("${data.lore}", data.lore)}
              </button>
            ))}

            {step === 'scene' && (
              <button onClick={() => {setStep('boss'); setShowOptions(false);}} className="w-full bg-red-100 hover:bg-red-200 border-4 border-slate-900 p-5 rounded-2xl font-bold text-2xl text-red-600 text-center transition-all active:translate-y-1">
                [ 妈呀！快跑！ ]
              </button>
            )}

            {step === 'boss' && (
              <div className="p-8 bg-slate-50 border-4 border-slate-900 rounded-3xl w-full">
                <p className="text-xl font-black mb-4 text-blue-600">生死提问：{data.spell_question}</p>
                <input
                  className="w-full bg-white border-2 border-slate-900 p-4 rounded-xl mb-6 text-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="请输入答案保命..."
                  autoFocus
                />
                <button onClick={() => {
                  if (input.trim() === data.spell_answer) setStep('end');
                  else alert("回答错误！主神系统判定你还是死在【" + data.lore + "】里比较好。");
                }} className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold text-2xl hover:bg-blue-600 transition-all active:translate-y-1 text-center">
                  提交并存档
                </button>
              </div>
            )}
          </div>
        )}

        {/* 重新整人按钮 */}
        {step === 'end' && (
          <button onClick={() => window.location.href='/create'} className="mt-10 text-slate-400 hover:text-blue-500 underline w-full text-center font-bold"> 我也要整人 </button>
        )}

      </div>
    </main>
  );
}