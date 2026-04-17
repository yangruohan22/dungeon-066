'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CreateDungeon() {
  const [formData, setFormData] = useState({
    creator_nick: '', target_name: '', site: '', lore: '', item: '',
    fear_boss: '', fear_punish: '', spell_question: '', spell_answer: '', final_message: ''
  });

  const [showPay, setShowPay] = useState(false);
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
      setShowPay(true);
    } else {
      alert("创建失败，网络波动！");
    }
    setLoading(false);
  };

  return (
    // 强制居中并添加垂直滚动（因为表单内容较长）
    <main className="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center py-12 px-4">

      {/* 居中大卡片 */}
      <div className="bg-white max-w-3xl w-full border-4 border-slate-900 rounded-3xl shadow-[12px_12px_0_#1e293b] p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-black mb-12 text-center text-slate-900 tracking-wider">
          [ 副本实验室 ]
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">你的代号</label>
              <input name="creator_nick" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-blue-50 transition-all" placeholder="例如：主神阿强" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">受害者姓名</label>
              <input name="target_name" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-blue-50 transition-all" placeholder="例如：大冤种老李" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400">那件离谱的事 (蠢事)</label>
            <input name="lore" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-yellow-50 transition-all" placeholder="例如：手机掉马桶还试图捞" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">降临坐标</label>
              <input name="site" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-slate-50 transition-all" placeholder="例如：六教教室" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">随身道具</label>
              <input name="item" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-slate-50 transition-all" placeholder="例如：活动室的钢琴" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t-2 border-dashed border-slate-200">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">恐怖实体 (Boss)</label>
              <input name="fear_boss" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-red-50 transition-all" placeholder="例如：一万字DDL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">惩罚动作</label>
              <input name="fear_punish" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-red-50 transition-all" placeholder="例如：在心头疯狂萦绕" />
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t-2 border-dashed border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">生死提问 (暗号问题)</label>
                <input name="spell_question" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-purple-50 transition-all" placeholder="例如：你的白月光是谁？" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400">唯一答案 (暗号)</label>
                <input name="spell_answer" required onChange={handleChange} className="w-full border-b-4 border-slate-900 p-3 text-xl font-bold outline-none focus:bg-purple-50 transition-all" placeholder="例如：翠花" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400">通关后的真心话</label>
              <textarea name="final_message" required maxLength={100} onChange={handleChange} className="w-full bg-white border-4 border-slate-900 rounded-xl p-4 h-28 text-xl font-bold outline-none focus:ring-4 focus:ring-purple-100 resize-none transition-all" placeholder="写点感人的或者更损的..." />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-2xl hover:bg-blue-600 transition-all shadow-[6px_6px_0_#334155] active:translate-y-1 disabled:opacity-50 mt-8"
          >
            {loading ? '正在写入位面数据...' : '[ 生成专属副本 ]'}
          </button>
        </form>
      </div>

      {/* 支付弹窗 */}
      {showPay && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-slate-900 p-8 max-w-sm w-full text-center rounded-3xl shadow-[12px_12px_0_#000] animate-in zoom-in duration-300">
            <h2 className="text-3xl font-black mb-6 text-slate-800">达成契约</h2>
            <div className="w-48 h-48 bg-slate-100 mx-auto mb-6 flex items-center justify-center border-4 border-dashed border-slate-400 rounded-2xl">
               <span className="text-slate-400 font-bold">此处放收款码</span>
            </div>
            <p className="font-bold mb-8 text-slate-500 text-sm">支付 0.66 元，系统将激活该副本。</p>
            <button
              onClick={() => {
                const url = `${window.location.origin}/dungeon/${createdId}`;
                navigator.clipboard.writeText(url);
                alert('链接已复制到剪贴板！');
              }}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xl mb-4 shadow-[4px_4px_0_#1e3a8a] active:translate-y-1 transition-all"
            >
              已支付，复制链接
            </button>
            <button onClick={() => setShowPay(false)} className="text-slate-400 hover:text-slate-600 underline font-bold"> 返回修改 </button>
          </div>
        </div>
      )}
    </main>
  );
}