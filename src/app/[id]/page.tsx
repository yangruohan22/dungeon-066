'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getRouteConfig, calculateSettlement } from '../../../config/story';

// 带停顿呼吸感的打字机 (彻底修复重打 Bug 版)
const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 使用 ref 存住最新的回调函数，避免引发重复渲染
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (onCompleteRef.current) {
          setTimeout(() => {
            if (onCompleteRef.current) onCompleteRef.current();
          }, 600); // 打完字后停顿 600ms
        }
      }
    }, 45);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [text]); // 只监听 text，剔除 onComplete

  return <span className="whitespace-pre-wrap">{displayedText}</span>;
};

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
  const [showOptions, setShowOptions] = useState(false);
  const [showAllCatOptions, setShowAllCatOptions] = useState(false);
  const [hasClickedC, setHasClickedC] = useState(false);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [isRotated, setIsRotated] = useState(false);
  const [bossFails, setBossFails] = useState(0);
  const [bossInput, setBossInput] = useState('');

  // 最终页展开状态
  const [showPaper, setShowPaper] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);

  // 时空裂缝演出状态机
  const [riftPhase, setRiftPhase] = useState(0);

  // 纯净 Toast：无淡入，有淡出
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTimer, setToastTimer] = useState<NodeJS.Timeout | null>(null);

  const showToast = (msg: string, duration = 1500) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer) clearTimeout(toastTimer);
    const timer = setTimeout(() => {
      setToastVisible(false);
    }, duration);
    setToastTimer(timer);
  };

  const goStep = (newStep: string) => {
    setShowOptions(false);
    setStep(newStep);
    if (newStep === 'time_rift') {
      setRiftPhase(0);
    }
  };

  useEffect(() => {
    const fetchDungeon = async () => {
      const { data: d } = await supabase.from('dungeons').select('*').eq('id', params.id).single();
      if (d) setData(d);
    };
    fetchDungeon();
  }, [params.id]);

  useEffect(() => {
    if (step === 'time_rift') {
      if (riftPhase === 1) {
        const t = setTimeout(() => setRiftPhase(2), 1000);
        return () => clearTimeout(t);
      } else if (riftPhase === 2) {
        const t = setTimeout(() => setRiftPhase(3), 1200);
        return () => clearTimeout(t);
      }
    }
  }, [step, riftPhase]);

  if (!data) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">加载地球Online数据...</div>;

  const currentRoute = getRouteConfig(route, data);

  const handleActionClick = () => {
    if (actionCount >= currentRoute.limit) {
      if (currentRoute.limitAlert) showToast(currentRoute.limitAlert, 3500);
      return;
    }
    setActionCount(prev => prev + 1);

    if (currentRoute.isMoving) {
      setBtnPos({ x: Math.random() * 200 - 100, y: Math.random() * 100 - 50 });
    }

    if (Array.isArray(currentRoute.normalAlert)) {
      const randomSound = currentRoute.normalAlert[Math.floor(Math.random() * currentRoute.normalAlert.length)];
      setRoarCounts(prev => ({ ...prev, [randomSound]: (prev[randomSound] || 0) + 1 }));
      showToast(randomSound);
    } else {
      showToast(currentRoute.normalAlert);
    }
  };

  const handleTalentPerform = () => {
    if (!currentTalent.trim()) return;
    if (talents.length < 3) {
      setTalents([...talents, currentTalent]);
      setCurrentTalent('');
      showToast(currentRoute.talentType === 'cat' ? '小猫眨眨眼睛，没看够。' : '人群鼓掌，再来一个！');
    } else {
      showToast(currentRoute.talentType === 'cat' ? '小猫看厌了，转身离开' : '人群看厌了，转身离开', 2500);
      goStep('transition');
    }
  };

  const handleDownloadImage = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('settlement-card');
      if (element) {
        const btn = document.getElementById('dl-settle-btn');
        if (btn) btn.style.display = 'none';
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#fcf5e5', useCORS: true });
        if (btn) btn.style.display = 'flex';
        const link = document.createElement('a');
        link.download = `地球Online结算单-${data.target_name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (e) {
      showToast("截图生成失败，请尝试手动截屏！", 3500);
    }
  };

  const handleDownloadNote = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById('note-card');
      if (element) {
        const btn = document.getElementById('dl-note-btn');
        if (btn) btn.style.display = 'none';
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: null, useCORS: true });
        if (btn) btn.style.display = 'block';
        const link = document.createElement('a');
        link.download = `来自${data.creator_nick}的小纸条.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (e) {
      showToast("截图生成失败，请尝试手动截屏！", 3500);
    }
  };

  // 统一定义结算单内部的字体样式
  const labelClass = "retro-text text-[#8b5a2b] text-lg font-bold mb-2 tracking-widest";
  const valueClass = "font-sans text-[#3e3c38] text-xl font-black mb-6 leading-relaxed";

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center justify-center p-4">

      {/* Toast 提示框 */}
      <div className={`fixed top-12 left-0 right-0 z-50 flex justify-center pointer-events-none transition-opacity duration-500 ${toastVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-slate-900/95 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-lg text-center max-w-[90%] break-words">
          {toastMsg}
        </div>
      </div>

      {/* 唯一主卡片容器 */}
      <div className={`bg-white max-w-2xl w-full border-4 border-slate-900 rounded-3xl solid-shadow p-8 md:p-12 transition-all duration-500 overflow-hidden ${step === 'time_rift' && riftPhase === 1 ? 'animate-fierce-shake' : ''}`}>

        {step === 'intro' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-2xl font-bold min-h-[60px]">
              <Typewriter text={`亲爱的【${data.target_name}】，恭喜你在【地球Online】解锁了新副本！`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-bottom">
                <button onClick={() => goStep('mail')} className="block w-full bg-blue-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">立即探索</button>
                <button onClick={() => goStep('abandon')} className="block w-full bg-slate-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">放弃探索</button>
                <button onClick={() => showToast("那不好意思了，这个选项也无法选中~")} className="block w-full bg-slate-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">只要我不表态，你就无法选中我</button>
              </div>
            )}
          </div>
        )}

        {step === 'mail' && (
          <div className="text-center space-y-6 animate-in zoom-in">
            <div className="text-6xl mb-4">✉️</div>
            <div className="text-2xl font-bold min-h-[40px]">
              <Typewriter text={`你收到了一封邮件`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <button onClick={() => goStep('intro')} className="w-full bg-blue-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl animate-in slide-in-from-bottom">打开</button>
            )}
          </div>
        )}

        {step === 'abandon' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-2xl font-bold min-h-[40px]">
              <Typewriter text={`【${data.creator_nick}】：来都来了。`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <button onClick={() => goStep('site')} className="w-full bg-blue-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1 animate-in slide-in-from-bottom">好吧</button>
            )}
          </div>
        )}

        {step === 'site' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-xl font-bold leading-relaxed min-h-[80px]">
              <Typewriter text={`你来到了【${data.site}】，这里芳草鲜美，落英缤纷，你在心里由衷感谢着把你送来这里的【${data.creator_nick}】：`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-bottom">
                <input maxLength={15} value={thankYouMsg} onChange={e=>setThankYouMsg(e.target.value)} className="w-full border-b-4 border-slate-900 p-3 text-xl outline-none" placeholder="输入心里话(15字以内)"/>
                <button onClick={() => { if(thankYouMsg) goStep('cat'); else showToast('心里话不能为空！'); }} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1">提交</button>
              </div>
            )}
          </div>
        )}

        {step === 'cat' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-xl font-bold min-h-[80px]">
              {/* 【修改】：此时你前面加了换行 */}
              <Typewriter text={`一只会读心术的小猫听到了你的心里话，优雅地走过来：喵喵喵！（你心里话的声音好大！）\n此时你：`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-bottom">
                <button onClick={() => goStep('q2_A')} className="block w-full text-left bg-slate-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">A. 尝试友好交流：喵喵喵！（%#@-#&￥@！）</button>
                <button onClick={() => goStep('q2_B')} className="block w-full text-left bg-slate-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">B. 什么？小猫！一把抱走</button>
                <button onClick={() => {
                  if (!hasClickedC) {
                    setHasClickedC(true);
                    setShowAllCatOptions(true);
                  } else {
                    showToast("不是给你更多选项了吗？怎么还来压榨我。", 2500);
                  }
                }} className="block w-full text-left bg-slate-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">C. 这都什么破选项，我选不出来</button>

                {showAllCatOptions && (
                  <div className="space-y-4 animate-in fade-in duration-500 pt-2">
                    <button onClick={() => goStep('q2_D')} className="block w-full text-left bg-yellow-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">D. 被吓到</button>
                    <button onClick={() => goStep('q2_E')} className="block w-full text-left bg-yellow-50 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">E. 不知从哪里掏出一把猫粮</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 'q2_A' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-xl font-bold min-h-[60px]">
              <Typewriter text={`这是一只贪婪的小猫，它发现你很友好，于是蹬鼻子上脸，坐在了你的头上：`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <button onClick={() => { setRoute(1); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">挥舞着【{data.fear_boss}】试图驱赶小猫</button>
                <button onClick={() => { setRoute(2); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">把【{data.item}】放在前面，引诱小猫下来</button>
                <button onClick={() => { setRoute(3); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">我的小猫我来宠，原地表演【{data.lore}】</button>
                <button onClick={() => showToast("小猫虽好，不要贪杯哦~")} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">深吸一口，被小猫味搞得晕头转向</button>
              </div>
            )}
          </div>
        )}

        {step === 'q2_B' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-xl font-bold min-h-[80px]">
              <Typewriter text={`小猫灵活地挣脱了！你发现周围不知道什么时候聚集了一群人，他们把你当成了偷猫贼（虽然本来就是）：`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <button onClick={() => { setRoute(4); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">从兜里掏出【{data.fear_boss}】试图驱赶人群</button>
                <button onClick={() => { setRoute(5); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">悄悄问旁边的人要不要【{data.item}】，企图贿赂ta</button>
                <button onClick={() => { setRoute(6); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">已经这么尴尬了，还能怎么样？开始表演【{data.lore}】</button>
                <button onClick={() => showToast("嗯对。")} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">只要我不尴尬，尴尬的就是别人</button>
              </div>
            )}
          </div>
        )}

        {step === 'q2_D' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-xl font-bold min-h-[40px]">
              <Typewriter text={`小猫嘿嘿一笑：`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <button onClick={() => { setRoute(7); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">愣在原地，看着小猫一步一步朝自己走来</button>
                <button onClick={() => { setRoute(8); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">拿出【{data.item}】，放在自己和小猫中间</button>
                <button onClick={() => { setRoute(9); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">把小猫介绍给【{data.fear_boss}】</button>
                <button onClick={() => showToast(`请你有自知之明一点，你还想像上次【${data.lore}】一样尴尬吗！`, 3000)} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">你却将身一扭，反从小猫的胯下逃走了</button>
              </div>
            )}
          </div>
        )}

        {step === 'q2_E' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-xl font-bold min-h-[40px]">
              <Typewriter text={`小猫走到你身边，欢快地吃了起来：`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-right">
                <button onClick={() => { setRoute(10); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">我是让你吃猫粮啊，你在吃什么？！</button>
                <button onClick={() => { setRoute(11); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">从兜里掏出【{data.fear_boss}】，想让小猫把ta也吃掉</button>
                <button onClick={() => { setRoute(12); goStep('action'); }} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">拿出【{data.item}】，也装模作样吃了起来</button>
                <button onClick={() => showToast("真的吗。。。")} className="block w-full text-left bg-slate-50 border-2 p-4 rounded-xl font-bold border-slate-900">真好啊，让你忘了那次【{data.lore}】有多尴尬</button>
              </div>
            )}
          </div>
        )}

        {step === 'action' && currentRoute && (
          <div className="space-y-8 animate-in fade-in relative">
            <div className="text-2xl font-bold leading-relaxed min-h-[120px]">
              <Typewriter text={currentRoute.text} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="animate-in slide-in-from-bottom">
                <div className="flex justify-center relative h-20 mb-8">
                  <button
                    onClick={handleActionClick}
                    style={{ transform: `translate(${btnPos.x}px, ${btnPos.y}px)`, transition: 'transform 0.1s' }}
                    className="bg-red-100 border-4 border-slate-900 px-8 py-4 rounded-2xl font-black text-xl text-red-600 active:scale-95 z-10"
                  >
                    {currentRoute.actionBtn}
                  </button>
                </div>
                <button onClick={() => goStep('talent')} className="w-full text-slate-400 font-bold underline text-center block">
                  {currentRoute.advanceBtn}
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'talent' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-xl font-bold min-h-[40px]">
              <Typewriter text={currentRoute.talentType === 'cat' ? '猫猫判官正严厉地注视着你：' : '人群正期待着你的表演：'} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-bottom">
                <div className="bg-slate-100 border-2 border-dashed border-slate-900 p-4 rounded-xl text-sm font-bold text-slate-500 min-h-[60px]">
                  已表演：{talents.join('、') || '无'}
                </div>
                <input maxLength={15} value={currentTalent} onChange={e=>setCurrentTalent(e.target.value)} className="w-full border-b-4 border-slate-900 p-3 text-xl outline-none" placeholder="输入才艺(15字以内)"/>
                <button onClick={handleTalentPerform} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1">表演</button>

                {talents.length >= 3 && (
                  <button onClick={() => goStep('transition')} className="w-full mt-4 bg-yellow-100 border-2 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">
                    {currentRoute.talentType === 'cat' ? '小猫大人，行行好吧，我实在演不动了' : '都散了吧，我演不动了！'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {step === 'transition' && (
          <div className="space-y-8 text-center animate-in fade-in">
            <div className="text-2xl font-bold min-h-[80px]">
              <Typewriter text={`你以为表演才艺就是你的全部任务？你把这个副本想得太简单了。`} onComplete={() => setShowOptions(true)} />
            </div>
            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-bottom">
                <button
                  onClick={() => setIsRotated(!isRotated)}
                  className={`w-full bg-slate-100 border-4 border-slate-900 p-4 rounded-xl font-bold text-xl transition-transform duration-500 ${isRotated ? 'rotate-180' : ''}`}
                >
                  我倒要看看
                </button>
                <button onClick={() => goStep('time_rift')} className="w-full bg-blue-100 border-4 border-slate-900 p-4 rounded-xl font-bold text-xl active:translate-y-1">放马过来吧</button>
              </div>
            )}
          </div>
        )}

        {step === 'time_rift' && (
          <div className="space-y-8 flex flex-col items-center justify-center min-h-[350px]">

            {riftPhase < 2 && (
              <div className="text-4xl font-black text-red-600 text-center animate-in zoom-in w-full">
                <Typewriter text={`你掉进了\n时空裂缝！`} onComplete={() => setRiftPhase(1)} />
              </div>
            )}

            {riftPhase >= 2 && (
              <div className="relative w-[360px] h-[360px] flex items-center justify-center animate-in fade-in duration-500">
                <div className={`absolute inset-0 flex items-center justify-center ${riftPhase === 2 ? 'animate-spin-scale' : 'animate-slow-spin'}`}>
                  {Array.from({length: 16}).map((_, i) => (
                    <span key={i} className="absolute text-3xl font-black text-blue-600" style={{ transform: `rotate(${i * (360/16)}deg) translateY(-175px)` }}>马</span>
                  ))}
                </div>

                <div className="text-center font-bold text-xl z-10 px-10 leading-loose text-slate-800">
                  {riftPhase === 3 && (
                    /* 【修改】：去掉了这里的换行 */
                    <Typewriter text={`快速穿梭中你遗失了【${data.item}】，但是【${data.fear_boss}】还跟着你！`} onComplete={() => setShowOptions(true)} />
                  )}
                </div>
              </div>
            )}

            {showOptions && riftPhase === 3 && (
              <button onClick={() => goStep('boss')} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1 animate-in zoom-in mt-4">没招了</button>
            )}
          </div>
        )}

        {step === 'boss' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-xl font-bold leading-relaxed min-h-[120px]">
              <Typewriter text={`在通往出口的唯一道路上，站着【${data.fear_boss}】，ta威胁你，如果你回答不出下面的问题，就要【${data.fear_punish}】。`} onComplete={() => setShowOptions(true)} />
            </div>

            {showOptions && (
              <div className="space-y-4 animate-in slide-in-from-bottom">
                <p className="text-2xl font-black text-red-600">Q: {data.spell_question}</p>
                <input maxLength={15} value={bossInput} onChange={e=>setBossInput(e.target.value)} className="w-full border-b-4 border-slate-900 p-3 text-xl outline-none focus:bg-red-50" placeholder="输入答案(15字以内)..."/>
                <button onClick={() => {
                  if(bossInput.trim() === data.spell_answer) goStep('win_slip');
                  else {
                    setBossFails(prev => prev + 1);
                    showToast(`答案错误！【${data.fear_boss}】又近了一步！`, 3500);
                  }
                }} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-xl active:translate-y-1">提交答案</button>

                {bossFails >= 3 && (
                  <button onClick={() => setBossInput(data.spell_answer)} className="w-full mt-4 bg-yellow-100 border-4 border-slate-900 p-4 rounded-xl font-bold text-lg active:translate-y-1">
                    呼叫【{data.creator_nick}】获取答案
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 终极融合页面：小纸条 + 结算单 + 坑朋友大按钮 */}
        {step === 'win_slip' && (
          <div className="text-center w-full animate-in fade-in duration-700">
            <div className="text-2xl font-black text-green-600 min-h-[80px]">
               <Typewriter text={`恭喜！你已经在【${data.creator_nick}】制作的副本中胜利通关！`} onComplete={() => setShowOptions(true)} />
            </div>

            {showOptions && (
              <div className="mt-8 space-y-6 w-full animate-in slide-in-from-bottom flex flex-col items-center">

                <div className="w-full bg-slate-50 border-4 border-slate-900 p-6 rounded-2xl flex flex-col items-center">
                  <p className="font-bold text-slate-500 mb-4">Ta给你留了一个小纸条……</p>
                  <button onClick={() => setShowPaper(!showPaper)} className="text-6xl hover:scale-110 transition-transform mb-2">✉️</button>

                  {showPaper && (
                    <div id="note-card" className="sticky-note p-10 mt-6 min-h-[140px] w-[90%] max-w-sm transform -rotate-2 animate-in zoom-in text-left relative flex flex-col justify-center text-slate-800">
                      <p className="text-2xl font-bold leading-relaxed">{data.final_message}</p>
                      <div className="w-full text-right mt-6 font-black text-slate-700 text-lg">
                        —— {data.creator_nick}
                      </div>
                      <button id="dl-note-btn" onClick={handleDownloadNote} className="absolute bottom-3 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm">
                        💾 保存
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full bg-slate-50 border-4 border-slate-900 p-6 rounded-2xl flex flex-col items-center">
                  <p className="font-bold text-slate-500 mb-4">查收胜利结算报告：</p>
                  <button onClick={() => setShowSettlement(!showSettlement)} className="text-6xl hover:scale-110 transition-transform mb-2">📜</button>

                  {showSettlement && (
                    <div id="settlement-card" className="w-full retro-paper p-8 md:p-12 rounded-xl text-left animate-in zoom-in mt-6 relative overflow-hidden">

                      {/* 【绝对保证存在的印章】：纯 Tailwind 强制定位于右上角 */}
                      <div className="absolute top-6 right-6 w-24 h-24 border-[5px] border-double border-red-700/70 rounded-full text-red-700 font-black flex items-center justify-center -rotate-12 opacity-70 text-2xl tracking-widest font-serif z-10 pointer-events-none mix-blend-multiply select-none">
                        已通关
                      </div>

                      <h2 className="text-3xl retro-text font-black text-center mb-8 text-[#5c4d3c] border-b-2 border-[#d4c4af] pb-6">
                        【{data.site}】副本结算单
                      </h2>

                      {(() => {
                        const res = calculateSettlement(route, actionCount, roarCounts, data);
                        return (
                          <div className="space-y-2 mb-8">
                            <p className={labelClass}>称号</p>
                            <p className={valueClass}>{res.title}</p>
                            <p className={labelClass}>你曾经：</p>
                            <p className={valueClass}>{res.desc}</p>
                          </div>
                        );
                      })()}

                      <div className="retro-divider"></div>

                      {/* 【修改】：变成了题干字体样式 */}
                      <p className={`${labelClass} mb-6 leading-relaxed`}>
                        在【地球Online】游戏副本中，你掉进了时空裂缝，与【{data.fear_boss}】狭路相逢，经历了太多太多不如意的事情。
                      </p>

                      <p className={labelClass}>但是别灰心，你还有不少才艺：</p>
                      <ul className="list-disc list-inside pl-2 mb-6 space-y-1">
                        {talents.map((t, i) => <li key={i} className={valueClass} style={{marginBottom: '0.25rem'}}>{t}</li>)}
                      </ul>

                      <div className="retro-divider"></div>

                      {/* 【修改】：变成了题干字体样式 */}
                      <p className={`${labelClass} leading-relaxed`}>
                        更可贵的是，你对把你带到【{data.site}】的朋友【{data.creator_nick}】心怀感恩：
                      </p>
                      <p className={`${valueClass} mt-3`}>
                        “{thankYouMsg}”
                      </p>

                      <p className="text-center font-black text-xl text-[#6b8e23] pt-6 border-t-2 border-[#d4c4af]">
                        本次副本闯关到此全部结束，请收拾好您的行李物品，回归主线任务！加油！
                      </p>

                      {/* 【修改】：左右两侧页脚字体均统一为题干浅棕色宋体 */}
                      <div className="mt-10 pt-4 border-t-2 border-dashed border-[#d4c4af] flex flex-col sm:flex-row justify-between items-center opacity-70 gap-2">
                        <p className={`${labelClass} mb-0 text-sm`}>地球Online·专属人生副本</p>
                        <p className={`${labelClass} mb-0 text-sm`}>前往 bazinga66.top 为损友定制</p>
                      </div>

                      <button
                        id="dl-settle-btn"
                        onClick={handleDownloadImage}
                        className="w-full mt-8 bg-[#3e3c38] text-[#fdf6e3] p-4 rounded-xl font-bold text-xl active:translate-y-1 shadow-lg flex items-center justify-center gap-2"
                      >
                        <span className="text-2xl">📥</span> 保存结算单
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => window.location.href='/create'}
                  className="w-full mt-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl font-black text-2xl active:translate-y-2 shadow-[0_8px_0_#1e3a8a] active:shadow-none transition-all animate-bounce"
                >
                  🔥 我也要去坑朋友！
                </button>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}