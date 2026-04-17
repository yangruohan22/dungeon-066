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
    const { data, error } = await supabase
      .from('dungeons')
      .insert([formData])
      .select()
      .single();

    if (error) {
      alert('主神空间能量波动（保存失败）：' + error.message);
      setLoading(false);
      return;
    }
    setCreatedId(data.id);
    setShowPay(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#e2e8f0] py-12 px-4 text-slate-800 font-sans">
      <div className="max-w-3xl mx-auto bg-white border-4 border-slate-800 rounded-3xl shadow-[12px_12px_0_#475569] p-8 md:p-12">
        <h1 className="text-4xl font-black mb-12 text-center text-slate-800">
          [ 副本实验室 ]
        </h1>

        <form onSubmit={handleSubmit} className="space-y-12">

          {/* 区域 I：基础设定 */}
          <section className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold bg-blue-200 inline-block px-3 py-1 rounded-lg mb-6 shadow-sm">I. 基础设定</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">你的代号</label>
                <input name="creator_nick" required maxLength={10} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-blue-100 outline-none" placeholder="你是谁？" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">受害者姓名</label>
                <input name="target_name" required maxLength={10} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-blue-100 outline-none" placeholder="谁要倒霉了？" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-500 mb-2">降临地点</label>
                <input name="site" required maxLength={20} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-blue-100 outline-none" placeholder="例：六教水房" />
              </div>
            </div>
          </section>

          {/* 区域 II：黑历史 */}
          <section className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold bg-yellow-200 inline-block px-3 py-1 rounded-lg mb-6 shadow-sm">II. 羞耻设定</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">离谱瞬间 (Ta干过的蠢事)</label>
                <input name="lore" required maxLength={30} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-yellow-100 outline-none" placeholder="例：手机掉进马桶还试图捞" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">Ta的心头好 (随身物品)</label>
                <input name="item" required maxLength={20} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-yellow-100 outline-none" placeholder="例：31号楼活动室的钢琴" />
              </div>
            </div>
          </section>

          {/* 区域 III：破防环节 */}
          <section className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold bg-red-200 inline-block px-3 py-1 rounded-lg mb-6 shadow-sm">III. 破防环节</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">恐怖实体 (Boss)</label>
                <input name="fear_boss" required maxLength={20} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-red-100 outline-none" placeholder="例：堆积如山的DDL" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">破防小剧场 (Boss干啥)</label>
                <input name="fear_punish" required maxLength={40} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-red-100 outline-none" placeholder="例：在心头萦绕" />
              </div>
            </div>
          </section>

          {/* 区域 IV：终极封印 */}
          <section className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6">
            <h2 className="text-xl font-bold bg-purple-200 inline-block px-3 py-1 rounded-lg mb-6 shadow-sm">IV. 终极封印</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">通关提问 (只有Ta知道)</label>
                  <input name="spell_question" required maxLength={30} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-purple-100 outline-none" placeholder="例：你初恋是谁？" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">唯一答案 (暗号)</label>
                  <input name="spell_answer" required maxLength={20} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 text-xl focus:ring-4 focus:ring-purple-100 outline-none" placeholder="输入答案" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">通关后的真心话</label>
                <textarea name="final_message" required maxLength={100} onChange={handleChange} className="w-full bg-white border-2 border-slate-800 rounded-lg p-3 h-24 text-xl focus:ring-4 focus:ring-purple-100 outline-none resize-none" placeholder="写点感人的或者更损的..." />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-5 rounded-2xl font-black text-2xl hover:bg-slate-700 shadow-[8px_8px_0_#94a3b8] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? '[ 正在刻录... ]' : '[ 生成副本 ]'}
          </button>
        </form>
      </div>

      {/* 支付弹窗 */}
      {showPay && (
        <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-slate-800 p-8 max-w-sm w-full text-center rounded-2xl shadow-[12px_12px_0_#000]">
            <h2 className="text-2xl font-black mb-6 text-slate-800">契约生成</h2>
            <div className="w-48 h-48 bg-slate-100 mx-auto mb-6 flex items-center justify-center border-4 border-dashed border-slate-400 rounded-xl">
               <span className="text-slate-400 font-bold">此处放收款码</span>
            </div>
            <p className="font-bold mb-6 text-slate-600 text-sm">支付 0.66 元，主神将亲自为您降临副本。</p>
            <button
              onClick={() => {
                const url = `${window.location.origin}/dungeon/${createdId}`;
                navigator.clipboard.writeText(url);
                alert('链接已刻入剪贴板！快去发给Ta吧！');
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-xl shadow-[4px_4px_0_#1e3a8a] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all mb-4"
            >
              已支付，复制链接
            </button>
            <button onClick={() => setShowPay(false)} className="text-slate-400 hover:text-slate-600 underline text-sm font-bold"> 返回修改 </button>
          </div>
        </div>
      )}
    </div>
  );
}