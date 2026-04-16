'use client';
import { useState, useEffect } from 'react';
import { STORY_MATRIX } from '../../../config/story';

export default function DungeonPage({ params }: { params: { id: string } }) {
  const [step, setStep] = useState('intro');
  const [path, setPath] = useState({ q1: 0, q2: 0 });
  const [attempts, setAttempts] = useState(0);
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>(null);

  // 模拟从数据库获取数据 (实际开发请接入 Supabase)
  useEffect(() => {
    // 这里应该是 await supabase.from('dungeons').select('*')...
    // 暂时模拟一个数据结构
    setData({
      target_name: "老李",
      site: "三里屯的垃圾桶",
      lore: "把洗面奶当牙膏",
      item: "一根没水的红笔",
      fear_boss: "长着触手的闹钟",
      fear_punish: "在你耳边念 10 小时大悲咒",
      spell_question: "你第一条 QQ 签名是什么？",
      spell_answer: "仰望星空",
      final_message: "明天的早饭你请了哈！",
      creator_nick: "阿强"
    });
  }, [params.id]);

  if (!data) return <div className="p-10 text-green-500">>>> 正在连接主神空间...</div>;

  const matrix = STORY_MATRIX(data);

  const handleVerify = () => {
    if (input.trim() === data.spell_answer) {
      setStep('end');
    } else {
      setAttempts(prev => prev + 1);
      alert("逻辑验证失败，系统判定你脑子进了点 " + data.lore);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="scanline"></div>
      <div className="max-w-xl w-full p-8 terminal-border bg-black relative z-10">

        {step === 'intro' && (
          <div className="space-y-4">
            <p className="typing">>>> 检测到显眼包: {data.target_name}</p>
            <p>>>> 降临地点: {data.site}</p>
            <p>>>> 携带神器: {data.item}</p>
            <p>>>> 系统报告: 该个体曾执行 [{data.lore}]，智力值已归零。</p>
            <button onClick={() => setStep('q1')} className="mt-6 border border-green-500 px-4 py-2 hover:bg-green-900"> [ 开启试炼 ] </button>
          </div>
        )}

        {step === 'q1' && (
          <div className="space-y-4">
            <p>问题 1: 在这种鬼地方，你打算怎么展示个人魅力？</p>
            {matrix.q1.map((opt, i) => (
              <button key={i} onClick={() => {setPath({...path, q1: i}); setStep('q2')}} className="block w-full text-left p-2 hover:bg-green-900">> {opt.text}</button>
            ))}
          </div>
        )}

        {step === 'q2' && (
          <div className="space-y-4">
            <p>问题 2: 此时突然跳出一只盯着你看的野猪，你打算？</p>
            {matrix.q2[path.q1].map((opt, i) => (
              <button key={i} onClick={() => {setPath({...path, q2: i}); setStep('scene')}} className="block w-full text-left p-2 hover:bg-green-900">> {opt.text}</button>
            ))}
          </div>
        )}

        {step === 'scene' && (
          <div className="space-y-4">
            <p>{matrix.scenes[path.q1][path.q2].act}</p>
            <p>{matrix.scenes[path.q1][path.q2].res}</p>
            <button onClick={() => setStep('boss')} className="mt-4 border border-green-500 px-4 py-2 hover:bg-green-900"> [ 糟了 ] </button>
          </div>
        )}

        {step === 'boss' && (
          <div className="space-y-6">
            <p className="text-red-500 animate-pulse font-bold">!!! {data.fear_boss} 已锁定你 !!!</p>
            <p>正在执行: {data.fear_punish}</p>
            <div className="pt-4 border-t border-green-900">
              <p className="text-yellow-500 mb-2">【生死提问】: {data.spell_question}</p>
              <input 
                className="bg-black border-b border-green-500 w-full mb-4 text-xl"
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
                maxLength={50}
              />
              <button onClick={handleVerify} className="w-full bg-green-900 py-2"> 交付答案 </button>
              {attempts >= 3 && (
                <button onClick={() => setStep('end')} className="w-full text-xs text-red-500 mt-4 underline italic">
                  [ 算了，你这脑子肯定记不住，直接走过去吧 ]
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'end' && (
          <div className="space-y-4 text-center">
            <p className="text-gray-500 text-sm">>>> 副本已格式化。正在回归现实...</p>
            <p className="text-xl">“其实这只是 {data.creator_nick} 送你的赛博惊吓。”</p>
            <div className="my-8 p-4 border-2 border-dashed border-green-500">
              <p className="text-2xl font-bold">"{data.final_message}"</p>
            </div>
            <button onClick={() => window.location.href='/create'} className="text-xs opacity-50 hover:opacity-100"> 我也要整人 </button>
          </div>
        )}

      </div>
    </div>
  );
}