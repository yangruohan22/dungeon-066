'use client';
import { useState, useEffect } from 'react';
import { STORY_MATRIX } from '../../../config/story';
import { supabase } from '@/lib/supabase';

// 修复后的、情绪稳定的打字机组件
const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 80); // 【调整速度】：数字越大打字越慢，80是一个很舒服的阅读速度

    // 【关键修复】：这里去掉了 onComplete 依赖，防止输入框打字时引发重绘
    return () => clearInterval(timer);
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

  if (!data) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 text-xl">正在链接主神位面...</div>;

  const matrix = STORY_MATRIX(data);

  return (
    // 【修复居中】：使用了 min-h-screen 配合 flex items-center justify-center 确保绝对垂直+水平居中
    <div className="min-h-screen flex items-center justify-center w-full p-4 text-slate-800">
      <div className="max-w-2xl w-full bg-white border-4 border-slate-800 rounded-2xl shadow-[8px_8px_0_#475569] p-8 md:p-12 relative overflow-hidden transition-all">

        {/* 文字展示区 */}
        <div className="text-xl md:text-2xl leading-relaxed mb-8 min-h-[140px] font-medium">
          {step === 'intro' && (
            <Typewriter
              text={`[ 系统报告 ]\n检测到高能显眼包：${data.target_name}。\n降临坐标：${data.site}。\n系统评定：该个体曾执行过【${data.lore}】，初步判定为“逻辑缺失型”生物。`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'q1' && (
            <Typewriter
              text={`当前环境极度尴尬，你手中握着唯一的求生工具：【${data.item}】。请问你打算：`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'q2' && (
            <Typewriter
              text={`面对这种局面，你刚才的举动让空气凝固了足足 3 秒。现在，你决定：`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'scene' && (
            <Typewriter
              text={`${matrix.scenes[path.q1][path.q2].act}\n\n后果：${matrix.scenes[path.q1][path.q2].res}`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'boss' && (
            <Typewriter
              text={`!!! 警报 !!!\n由于你的表现过于“机灵”，【${data.fear_boss}】被强制激活了！\n它正在对你执行惨无人道的惩罚：${data.fear_punish}`}
              onComplete={() => setShowOptions(true)}
            />
          )}

          {step === 'end' && (
            <div className="text-center animate-in fade-in duration-1000">
              <p className="text-lg text-slate-400 mb-4">[ 副本格式化完成。正在回归现实... ]</p>
              <p className="text-2xl font-bold mb-8">“这是 {data.creator_nick} 专门给你定制的赛博大礼。”</p>
              <div className="bg-yellow-50 border-4 border-yellow-400 p-8 rounded-2xl transform -rotate-1">
                <p className="text-2xl font-bold text-slate-800">“{data.final_message}”</p>
              </div>
            </div>
          )}
        </div>

        {/* 交互选项区 */}
        {showOptions && step !== 'end' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            {step === 'intro' && (
              <button onClick={() => {setStep('q1'); setShowOptions(false);}} className="w-full bg-blue-100 hover:bg-blue-200 border-2 border-slate-800 p-4 rounded-xl font-bold text-xl shadow-[4px_4px_0_#475569] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                [ 接受试炼 ]
              </button>
            )}

            {step === 'q1' && matrix.q1.map((opt, i) => (
              <button key={i} onClick={() => {setPath({...path, q1: i}); setStep('q2'); setShowOptions(false);}} className="w-full text-left bg-slate-50 hover:bg-slate-100 border-2 border-slate-800 p-4 rounded-xl font-medium text-lg md:text-xl shadow-[4px_4px_0_#475569] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                # {opt.text.replace("${data.item}", data.item).replace("${data.lore}", data.lore)}
              </button>
            ))}

            {step === 'q2' && matrix.q2[path.q1].map((opt, i) => (
              <button key={i} onClick={() => {setPath({...path, q2: i}); setStep('scene'); setShowOptions(false);}} className="w-full text-left bg-slate-50 hover:bg-slate-100 border-2 border-slate-800 p-4 rounded-xl font-medium text-lg md:text-xl shadow-[4px_4px_0_#475569] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                # {opt.text.replace("${data.item}", data.item).replace("${data.lore}", data.lore)}
              </button>
            ))}

            {step === 'scene' && (
              <button onClick={() => {setStep('boss'); setShowOptions(false);}} className="w-full bg-red-100 hover:bg-red-200 border-2 border-slate-800 p-4 rounded-xl font-bold text-xl text-red-600 shadow-[4px_4px_0_#475569] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all">
                [ 妈呀！快跑！ ]
              </button>
            )}

            {step === 'boss' && (
              <div className="p-6 bg-slate-50 border-2 border-slate-800 rounded-xl">
                <p className="text-sm font-bold text-slate-500 mb-2">【生死提问】</p>
                <p className="text-xl font-bold mb-4 text-blue-600">Q: {data.spell_question}</p>
                <input
                  className="w-full bg-white border-2 border-slate-800 p-3 rounded-lg mb-4 text-xl focus:ring-4 focus:ring-blue-100 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入答案保命..."
                  autoFocus
                />
                <button onClick={() => {
                  if (input.trim() === data.spell_answer) setStep('end');
                  else alert("回答错误！主神系统判定你还是死在那次【" + data.lore + "】里比较好。");
                }} className="w-full bg-slate-800 hover:bg-slate-700 text-white p-4 rounded-xl font-bold text-xl transition-all mt-2">
                  交付答案
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'end' && (
          <div className="mt-8 text-center">
            <button onClick={() => window.location.href='/create'} className="text-slate-400 hover:text-slate-600 underline font-bold"> 我也想整人 </button>
          </div>
        )}
      </div>
    </div>
  );
}