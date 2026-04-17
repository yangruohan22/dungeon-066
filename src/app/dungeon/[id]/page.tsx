'use client';
import { useState, useEffect } from 'react';
import { STORY_MATRIX } from '../../../config/story';
import { supabase } from '@/lib/supabase'; // 确保路径正确

export default function DungeonPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState('intro');
  const [path, setPath] = useState({ q1: 0, q2: 0 });
  const [attempts, setAttempts] = useState(0);
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDungeon = async () => {
      const { data: dungeonData, error } = await supabase
        .from('dungeons')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !dungeonData) {
        console.error("加载失败:", error);
        setError(true);
        return;
      }
      setData(dungeonData);
    };

    if (params.id) {
      fetchDungeon();
    }
  }, [params.id]);

  if (error) return <div className="p-10 text-red-500 bg-black min-h-screen font-mono">&gt; 错误：副本已湮灭。</div>;
  if (!data) return <div className="p-10 text-green-500 bg-black min-h-screen font-mono animate-pulse">&gt; 正在同步主神空间数据...</div>;

  const matrix = STORY_MATRIX(data);

  const handleVerify = () => {
    if (input.trim() === data.spell_answer) {
      setStep('end');
    } else {
      setAttempts(prev => prev + 1);
      alert("逻辑验证失败。系统提示：Ta 的智力似乎还停留在 [" + data.lore + "] 阶段。");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-black text-green-500 font-mono">
      <div className="scanline"></div>
      <div className="max-w-xl w-full p-8 terminal-border bg-black relative z-10">

        {step === 'intro' && (
          <div className="space-y-4">
            <p className="typing">&gt;&gt;&gt; &gt; 目标确认: {data.target_name}</p>
            <p>&gt;&gt;&gt; &gt; 降临坐标: {data.site}</p>
            <p>&gt;&gt;&gt; &gt; 绑定神器: {data.item}</p>
            <p>&gt;&gt;&gt; &gt; 智力快照: 该个体曾执行 [{data.lore}]，智商已锁定。</p>
            <button onClick={() => setStep('q1')} className="mt-6 border border-green-500 px-4 py-2 hover:bg-green-500 hover:text-black transition-all"> [ 开启试炼 ] </button>
          </div>
        )}

        {step === 'q1' && (
          <div className="space-y-4">
            <p>问题 1: 在这种鬼地方，你打算怎么展示个人魅力？</p>
            {matrix.q1.map((opt, i) => (
              <button
                key={i}
                onClick={() => {setPath({...path, q1: i}); setStep('q2')}}
                className="block w-full text-left p-2 hover:bg-green-900 border border-transparent hover:border-green-500"
              >
                &gt; {opt.text}
              </button>
            ))}
          </div>
        )}

        {step === 'q2' && (
          <div className="space-y-4">
            <p>问题 2: 此时突然跳出一只盯着你看的野猪，你打算？</p>
            {matrix.q2[path.q1].map((opt, i) => (
              <button
                key={i}
                onClick={() => {setPath({...path, q2: i}); setStep('scene')}}
                className="block w-full text-left p-2 hover:bg-green-900 border border-transparent hover:border-green-500"
              >
                &gt;&gt;&gt; &gt; {opt.text}
              </button>
            ))}
          </div>
        )}

        {step === 'scene' && (
          <div className="space-y-4">
            <p>{matrix.scenes[path.q1][path.q2].act}</p>
            <p>{matrix.scenes[path.q1][path.q2].res}</p>
            <button onClick={() => setStep('boss')} className="mt-4 border border-green-500 px-4 py-2 hover:bg-red-900 hover:border-red-500"> [ 糟了 ] </button>
          </div>
        )}

        {step === 'boss' && (
          <div className="space-y-6">
            <p className="text-red-500 animate-pulse font-bold">!!! {data.fear_boss} 已锁定你 !!!</p>
            <p>惩罚措施: {data.fear_punish}</p>
            <div className="pt-4 border-t border-green-900">
              <p className="text-yellow-500 mb-2">【生死提问】: {data.spell_question}</p>
              <input
                className="bg-black border-b border-green-500 w-full mb-4 text-xl focus:border-yellow-500 outline-none"
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
                maxLength={50}
              />
              <button onClick={handleVerify} className="w-full bg-green-900 py-2 border border-green-500 hover:bg-green-600 hover:text-black"> 交付答案 </button>
              {attempts >= 3 && (
                <button onClick={() => setStep('end')} className="w-full text-xs text-red-500 mt-4 underline italic">
                  [ 算了，系统判定你已经彻底破防，直接滚吧 ]
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'end' && (
          <div className="space-y-4 text-center">
            <p className="text-gray-500 text-sm">&gt;&gt;&gt; &gt; 副本已崩塌。正在回归现实...</p>
            <p className="text-xl">“这其实是 {data.creator_nick} 送你的赛博大礼包。”</p>
            <div className="my-8 p-6 border-2 border-dashed border-green-500 bg-green-900/10">
              <p className="text-2xl font-bold text-yellow-500">"{data.final_message}"</p>
            </div>
            <button onClick={() => window.location.href='/create'} className="text-xs opacity-50 hover:opacity-100"> 我也要整人 </button>
          </div>
        )}

      </div>
    </div>
  );
}