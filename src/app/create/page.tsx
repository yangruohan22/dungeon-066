'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreateDungeon() {
  const [formData, setFormData] = useState({
    creator_nick: '', target_name: '', site: '', lore: '', item: '',
    fear_boss: '', fear_punish: '', spell_question: '', spell_answer: '', final_message: ''
  });

  const [showPay, setShowPay] = useState(false);
  const [isPaid, setIsPaid] = useState(false); // 新增：控制是否已支付的状态
  const [createdId, setCreatedId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.from('dungeons').insert([formData]).select().single();
    if (!error) {
      setCreatedId(data.id);
      setIsPaid(false); // 每次新生成时重置支付状态
      setShowPay(true);
    } else {
      alert("创建失败，网络波动！");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center py-12 px-4 font-sans">

      {/* 居中大卡片 */}
      <div className="bg-white max-w-3xl w-full border-4 border-slate-900 rounded-3xl shadow-[12px_12px_0_#1e293b] p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-black mb-12 text-center text-slate-900 tracking-wider">
          [ 副本生成器 ]
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">你的代号</label>
              <input name="creator_nick" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-blue-50 transition-all" placeholder="例如：新世界的神" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">受害者姓名</label>
              <input name="target_name" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-blue-50 transition-all" placeholder="此处写朋友称号" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">朋友做过的一件糗事</label>
            <input name="lore" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-yellow-50 transition-all" placeholder="例如：手机掉马桶还试图捞" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">你要把朋友传送到</label>
              <input name="site" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-slate-50 transition-all" placeholder="例如：王者峡谷，工位等" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">朋友的一件十分有个人特色的物品</label>
              <input name="item" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-slate-50 transition-all" placeholder="例如：一副只剩镜片的眼镜" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t-2 border-dashed border-slate-200">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">一个你朋友害怕/讨厌的家伙</label>
              <input name="fear_boss" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-red-50 transition-all" placeholder="例如：老板，大作业等" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">这个家伙的经典行为</label>
              <input name="fear_punish" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-red-50 transition-all" placeholder="例如：发消息：你到我办公室来一下" />
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t-2 border-dashed border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">一个你们两个都知道答案的问题</label>
                <input name="spell_question" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-purple-50 transition-all" placeholder="例如：你的第一个QQ签名是什么？" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">问题答案</label>
                <input name="spell_answer" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-purple-50 transition-all" placeholder="例如：不要迷恋哥。" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">给朋友留下一句真心话吧！</label>
              <textarea name="final_message" required maxLength={100} onChange={handleChange} className="w-full bg-white border-4 border-slate-900 rounded-xl p-4 h-28 text-xl font-bold outline-none focus:ring-4 focus:ring-purple-100 resize-none transition-all" placeholder="写点感人的或者更损的..." />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-2xl hover:bg-blue-600 transition-all shadow-[6px_6px_0_#334155] active:translate-y-1 disabled:opacity-50 mt-8"
          >
            {loading ? '炼丹中...' : '[ 为朋友生成专属副本 ]'}
          </button>
        </form>
      </div>

      {/* 支付与链接弹窗 */}
      {showPay && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-slate-900 p-8 max-w-sm w-full text-center rounded-3xl shadow-[12px_12px_0_#000] animate-in zoom-in duration-300">

            {!isPaid ? (
              // 步骤一：扫码支付页面
              <>
                <h2 className="text-3xl font-black mb-6 text-slate-800">达成契约</h2>
                <div className="w-48 h-48 bg-slate-100 mx-auto mb-6 flex items-center justify-center border-4 border-dashed border-slate-400 rounded-2xl">
                   <span className="text-slate-400 font-bold">假装这是一个付款码</span>
                </div>
                <p className="font-bold mb-8 text-slate-500 text-sm">支付66个鬼点子（100个鬼点子=1元），助力炼丹。</p>
                <button
                  onClick={() => setIsPaid(true)}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl mb-4 shadow-[4px_4px_0_#1e3a8a] active:translate-y-1 transition-all"
                >
                  我已支付！
                </button>
                <button onClick={() => setShowPay(false)} className="text-slate-400 hover:text-slate-600 underline font-bold"> 返回修改 </button>
              </>
            ) : (
              // 步骤二：直接展示链接页面
              <div className="animate-in fade-in zoom-in duration-500">
                <h2 className="text-2xl font-black mb-4 text-green-600">契约已生效！快忽悠朋友来体验吧！</h2>
                <p className="font-bold mb-4 text-slate-600 text-sm">请长按下方文字框手动复制链接：</p>

                {/* 链接展示框：使用了 select-all，点一下或者长按就能选中全部 */}
                <div className="bg-blue-50 border-4 border-slate-900 p-4 rounded-2xl mb-8 break-all select-all cursor-text text-left">
                  <span className="text-slate-800 font-bold text-lg leading-relaxed">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/dungeon/{createdId}
                  </span>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-xl shadow-[4px_4px_0_#334155] active:translate-y-1 transition-all"
                >
                  完成并再整一个
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </main>
  );
}