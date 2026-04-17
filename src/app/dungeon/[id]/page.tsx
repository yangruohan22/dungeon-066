'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getRouteConfig, calculateSettlement } from '../../../config/story';

export default function DungeonPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);

  // 核心状态机
  const [step, setStep] = useState('intro');
  const [route, setRoute] = useState(0);
  const [thankYouMsg, setThankYouMsg] = useState('');

  // 数据收集器
  const [actionCount, setActionCount] = useState(0);
  const [roarCounts, setRoarCounts] = useState<Record<string, number>>({});
  const [talents, setTalents] = useState<string[]>([]);
  const [currentTalent, setCurrentTalent] = useState('');

  // UI 控制状态
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [isRotated, setIsRotated] = useState(false);
  const [bossFails, setBossFails] = useState(0);
  const [bossInput, setBossInput] = useState('');

  useEffect(() => {
    const fetchDungeon = async () => {
      const { data: d } = await supabase.from('dungeons').select('*').eq('id', params.id).single();
      if (d) setData(d);
    };
    fetchDungeon();
  }, [params.id]);

  if (!data) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">加载地球Online数据...</div>;

  const currentRoute = getRouteConfig(route, data);

  // 动态按钮行为处理
  const handleActionClick = () => {
    if (actionCount >= currentRoute.limit) {
      if (currentRoute.limitAlert) alert(currentRoute.limitAlert);
      return;
    }
    setActionCount(prev => prev + 1);

    if (currentRoute.isMoving) {
      setBtnPos({ x: Math.random() * 200 - 100, y: Math.random() * 100 - 50 });
    }

    if (Array.isArray(currentRoute.normalAlert)) {
      const randomSound = currentRoute.normalAlert[Math.floor(Math.random() * currentRoute.normalAlert.length)];
      setRoarCounts(prev => ({ ...prev, [randomSound]: (prev[randomSound] || 0) + 1 }));
      alert(randomSound);
    } else {
      alert(currentRoute.normalAlert);
    }
  };

  // 才艺表演处理
  const handleTalentPerform = () => {
    if (!currentTalent.trim()) return;
    if (talents.length < 3) {
      setTalents([...talents, currentTalent]);
      setCurrentTalent('');
      alert(currentRoute.talentType === 'cat' ? '小猫眨眨眼睛，没看够。' : '人群鼓掌，再来一个！');
    } else {
      alert(currentRoute.talentType === 'cat' ? '小猫看厌了，转身离开' : '人群看厌了，转身离开');
      setStep('transition');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full border-4 border-slate-900 rounded-3xl solid-shadow p-8 md:p-12 transition-all duration-500 overflow-hidden">

        {/* --- 阶段1：开局与引入 --- */}
        {step === 'intro' && (
          <div className="space-y-6 animate-in fade-in">
            <p className="text-2xl font-bold">亲爱的【{data.target_name}】，恭喜你在【地球Online】解锁了新副本！</p>
            <button onClick={() => setStep('mail')} className="block w-full bg-blue-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">立即探索</button>
            <button onClick={() => setStep('abandon')} className="block w-full bg-slate-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">放弃探索</button>
            <button onClick={() => alert("那不好意思了，这个选项也无法选中~")} className="block w-full bg-slate-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">只要我不表态，你就无法选中我</button>
          </div>
        )}

        {step === 'mail' && (
          <div className="text-center space-y-6 animate-in zoom-in">
            <div className="text-6xl">✉️</div>
            <p className="font-bold">你收到了一封邮件</p>
            <button onClick={() => setStep('intro')} className="w-full bg-blue-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl">打开</button>
          </div>
        )}

        {step === 'abandon' && (
          <div className="space-y-6 animate-in fade-in">
            <p className="text-2xl font-bold">【{data.creator_nick}】：来都来了。</p>
            <button onClick={() => setStep('site')} className="w-full bg-blue-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">好吧</button>
          </div>
        )}

        {/* --- 阶段2：感谢留言与猫猫 --- */}
        {step === 'site' && (
          <div className="space-y-6 animate-in fade-in">
            <p className="text-xl font-bold leading-relaxed">你来到了【{data.site}】，这里芳草鲜美，落英缤纷，你在心里由衷感谢着把你送来这里的【{data.creator_nick}】：</p>
            <input maxLength={20} value={thankYouMsg} onChange={e=>setThankYouMsg(e.target.value)} className="w-full border-b-4 border-slate-900 p-3 text-xl outline-none" placeholder="输入心里话(20字以内)"/>
            <button onClick={() => { if(thankYouMsg) setStep('cat'); else alert('心里话不能为空！'); }} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1">提交</button>
          </div>
        )}

        {step === 'cat' && (
          <div className="space-y-6 animate-in fade-in">
            <p className="text-xl font-bold">一只会读心术的小猫听到了你的心里话，优雅地走过来：喵喵喵！（你心里话的声音好大！）此时你：</p>
            <button onClick={() => { setStep('q2_A'); }} className="block w-full text-left bg-slate-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">A. 尝试友好交流：喵喵喵！（%#@-#&￥@！）</button>
            <button onClick={() => { setStep('q2_B'); }} className="block w-full text-left bg-slate-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">B. 什么？小猫！一把抱走</button>
            <button onClick={() => { alert("不是给你更多选项了吗？怎么还来压榨我。"); setStep('cat_show_DE'); }} className="block w-full text-left bg-slate-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">C. 这都什么破选项，我选不出来</button>
          </div>
        )}

        {step === 'cat_show_DE' && (
          <div className="space-y-4 animate-in fade-in">
            <button onClick={() => { alert("不是给你更多选项了吗？怎么还来压榨我。"); }} className="block w-full text-left bg-slate-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg">C. 这都什么破选项，我选不出来</button>
            <button onClick={() => { setStep('q2_D'); }} className="block w-full text-left bg-yellow-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">D. 被吓到</button>
            <button onClick={() => { setStep('q2_E'); }} className="block w-full text-left bg-yellow-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">E. 不知从哪里掏出一把猫粮</button>
          </div>
        )}

        {/* --- 阶段3：分支路线分配 --- */}
        {step === 'q2_A' && (
          <div className="space-y-4 animate-in slide-in-from-right">
            <p className="text-xl font-bold mb-4">这是一只贪婪的小猫，它发现你很友好，于是蹬鼻子上脸，坐在了你的头上：</p>
            <button onClick={() => { setRoute(1); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">挥舞着【{data.fear_boss}】试图驱赶小猫</button>
            <button onClick={() => { setRoute(2); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">把【{data.item}】放在前面，引诱小猫下来</button>
            <button onClick={() => { setRoute(3); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">我的小猫我来宠，原地表演【{data.lore}】</button>
            <button onClick={() => alert("小猫虽好，不要贪杯哦~")} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">深吸一口，被小猫味搞得晕头转向</button>
          </div>
        )}

        {step === 'q2_B' && (
          <div className="space-y-4 animate-in slide-in-from-right">
            <p className="text-xl font-bold mb-4">小猫灵活地挣脱了！你发现周围不知道什么时候聚集了一群人，他们把你当成了偷猫贼（虽然本来就是）：</p>
            <button onClick={() => { setRoute(4); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">从兜里掏出【{data.fear_boss}】试图驱赶人群</button>
            <button onClick={() => { setRoute(5); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">悄悄问旁边的人要不要【{data.item}】，企图贿赂ta</button>
            <button onClick={() => { setRoute(6); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">已经这么尴尬了，还能怎么样？开始表演【{data.lore}】</button>
            <button onClick={() => alert("嗯对。")} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">只要我不尴尬，尴尬的就是别人</button>
          </div>
        )}

        {step === 'q2_D' && (
          <div className="space-y-4 animate-in slide-in-from-right">
            <p className="text-xl font-bold mb-4">小猫嘿嘿一笑：</p>
            <button onClick={() => { setRoute(7); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">愣在原地，看着小猫一步一步朝自己走来</button>
            <button onClick={() => { setRoute(8); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">拿出【{data.item}】，放在自己和小猫中间</button>
            <button onClick={() => { setRoute(9); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">把小猫介绍给【{data.fear_boss}】</button>
            <button onClick={() => alert(`请你有自知之明一点，你还想像上次【${data.lore}】一样尴尬吗！`)} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">你却将身一扭，反从小猫的胯下逃走了</button>
          </div>
        )}

        {step === 'q2_E' && (
          <div className="space-y-4 animate-in slide-in-from-right">
            <p className="text-xl font-bold mb-4">小猫走到你身边，欢快地吃了起来：</p>
            <button onClick={() => { setRoute(10); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">我是让你吃猫粮啊，你在吃什么？！</button>
            <button onClick={() => { setRoute(11); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">从兜里掏出【{data.fear_boss}】，想让小猫把ta也吃掉</button>
            <button onClick={() => { setRoute(12); setStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">拿出【{data.item}】，也装模作样吃了起来</button>
            <button onClick={() => alert("真的吗。。。")} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">真好啊，让你忘了那次【{data.lore}】有多尴尬</button>
          </div>
        )}

        {/* --- 阶段4：疯狂点击操作区 --- */}
        {step === 'action' && currentRoute && (
          <div className="space-y-8 min-h-[300px] relative">
            <p className="text-2xl font-bold leading-relaxed">{currentRoute.text}</p>
            <div className="flex justify-center relative h-20">
              <button
                onClick={handleActionClick}
                style={{ transform: `translate(${btnPos.x}px, ${btnPos.y}px)`, transition: 'transform 0.1s' }}
                className="bg-red-100 border-4 border-slate-900 px-8 py-4 rounded-2xl font-black text-xl text-red-600 active:scale-95 z-10"
              >
                {currentRoute.actionBtn}
              </button>
            </div>
            <button onClick={() => setStep('talent')} className="w-full text-slate-400 font-bold underline mt-8 text-center block">
              {currentRoute.advanceBtn}
            </button>
          </div>
        )}

        {/* --- 阶段5：才艺表演 --- */}
        {step === 'talent' && (
          <div className="space-y-6">
            <p className="text-xl font-bold">{currentRoute.talentType === 'cat' ? '猫猫判官正严厉地注视着你：' : '人群正期待着你的表演：'}</p>
            <div className="bg-slate-100 border-2 border-dashed border-slate-900 p-4 rounded-xl text-sm font-bold text-slate-500 min-h-[60px]">
              已表演：{talents.join('、') || '无'}
            </div>
            <input maxLength={20} value={currentTalent} onChange={e=>setCurrentTalent(e.target.value)} className="w-full border-b-4 border-slate-900 p-3 text-xl outline-none" placeholder="输入才艺(20字以内)"/>
            <button onClick={handleTalentPerform} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1">表演</button>

            {talents.length >= 3 && (
              <button onClick={() => setStep('transition')} className="w-full mt-4 bg-yellow-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">
                {currentRoute.talentType === 'cat' ? '小猫大人，行行好吧，我实在演不动了' : '都散了吧，我演不动了！'}
              </button>
            )}
          </div>
        )}

        {/* --- 阶段6：反转过渡 --- */}
        {step === 'transition' && (
          <div className="space-y-8 text-center animate-in fade-in">
            <p className="text-2xl font-bold">你以为表演才艺就是你的全部任务？你把这个副本想得太简单了。</p>
            <button
              onClick={() => setIsRotated(!isRotated)}
              className={`w-full bg-slate-100 border-4 border-slate-900 p-4 rounded-xl font-bold text-xl transition-transform duration-500 ${isRotated ? 'rotate-180' : ''}`}
            >
              我倒要看看
            </button>
            <button onClick={() => setStep('time_rift')} className="w-full bg-blue-100 border-4 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">放马过来吧</button>
          </div>
        )}

        {/* --- 阶段7：时空裂缝 --- */}
        {step === 'time_rift' && (
          <div className="space-y-8 flex flex-col items-center animate-in zoom-in">
            <div className="relative w-[280px] h-[280px] flex items-center justify-center">
              {Array.from({length: 16}).map((_, i) => (
                <span key={i} className="circle-char text-2xl font-black text-blue-600" style={{ transform: `rotate(${i * (360/16)}deg) translateY(-130px)` }}>马</span>
              ))}
              <div className="text-center font-bold text-lg z-10 px-6">
                快速穿梭中你遗失了【{data.item}】，但是【{data.fear_boss}】还跟着你！
              </div>
            </div>
            <button onClick={() => setStep('boss')} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1">没招了</button>
          </div>
        )}

        {/* --- 阶段8：终极拷问 --- */}
        {step === 'boss' && (
          <div className="space-y-6 animate-in slide-in-from-bottom">
            <p className="text-xl font-bold leading-relaxed">在通往出口的唯一道路上，站着【{data.fear_boss}】，ta威胁你，如果你回答不出下面的问题，就要【{data.fear_punish}】。</p>
            <p className="text-2xl font-black text-red-600">Q: {data.spell_question}</p>
            <input maxLength={20} value={bossInput} onChange={e=>setBossInput(e.target.value)} className="w-full border-b-4 border-slate-900 p-3 text-xl outline-none focus:bg-red-50" placeholder="输入答案..."/>
            <button onClick={() => {
              if(bossInput.trim() === data.spell_answer) setStep('win_slip');
              else setBossFails(prev => prev + 1);
            }} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1">提交答案</button>

            {bossFails >= 3 && (
              <button onClick={() => setBossInput(data.spell_answer)} className="w-full mt-4 bg-yellow-100 border-4 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">
                呼叫【{data.creator_nick}】获取答案
              </button>
            )}
          </div>
        )}

        {/* --- 阶段9：胜利与纸条 --- */}
        {step === 'win_slip' && (
          <div className="text-center space-y-6 animate-in fade-in duration-700">
            <p className="text-2xl font-black text-green-600">恭喜！你已经在【{data.creator_nick}】制作的副本中胜利通关！</p>
            <p className="font-bold text-slate-500">Ta给你留了一个小纸条……</p>
            <button onClick={() => setShowPaper(!showPaper)} className="text-6xl hover:scale-110 transition-transform">✉️</button>
            {showPaper && (
              <div className="bg-yellow-50 border-4 border-slate-900 p-6 rounded-xl font-bold text-xl animate-in zoom-in -rotate-2">
                {data.final_message}
              </div>
            )}
            <div className="pt-8 border-t-2 border-dashed border-slate-300">
              <p className="font-bold text-slate-500 mb-4">胜利结算报告：</p>
              <button onClick={() => setStep('settlement')} className="text-6xl hover:scale-110 transition-transform">📜</button>
            </div>
          </div>
        )}

        {/* --- 阶段10：最终结算单 --- */}
        {step === 'settlement' && (
          <div className="space-y-6 text-left animate-in slide-in-from-bottom">
            <h2 className="text-3xl font-black text-center mb-8 border-b-4 border-slate-900 pb-4">胜利结算报告</h2>

            {(() => {
              const res = calculateSettlement(route, actionCount, roarCounts, data);
              return (
                <div className="bg-slate-50 border-4 border-slate-900 p-6 rounded-2xl space-y-4">
                  <p className="text-xl"><strong>称号：</strong> <span className="text-blue-600 font-black">{res.title}</span></p>
                  <p className="text-lg"><strong>你曾经：</strong> {res.desc}</p>
                </div>
              );
            })()}

            <p className="font-bold text-slate-600 leading-relaxed">
              在【地球Online】游戏副本中，你掉进了时空裂缝，与【{data.fear_boss}】狭路相逢，经历了太多太多不如意的事情。
            </p>

            <div className="bg-blue-50 border-2 border-dashed border-slate-900 p-4 rounded-xl">
              <p className="font-bold mb-2">但是别灰心，你还有不少才艺：</p>
              <ul className="list-disc list-inside pl-4 font-bold text-slate-700">
                {talents.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>

            <p className="font-bold text-slate-600 leading-relaxed">
              更可贵的是，你对把你带到【{data.site}】的朋友【{data.creator_nick}】心怀感恩：<span className="text-blue-600">“{thankYouMsg}”</span>
            </p>

            <p className="text-center font-black text-xl text-green-600 pt-6">本次副本闯关到此全部结束，请收拾好您的行李物品，回归主线任务！加油！</p>

            <button onClick={() => window.location.href='/create'} className="w-full mt-8 bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1">我也要制作副本</button>
          </div>
        )}

      </div>
    </div>
  );
}