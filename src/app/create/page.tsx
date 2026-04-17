'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // 确保路径正确

export default function CreateDungeon() {
  const [formData, setFormData] = useState({
    creator_nick: '',
    target_name: '',
    site: '',
    lore: '',
    item: '',
    fear_boss: '',
    fear_punish: '',
    spell_question: '',
    spell_answer: '',
    final_message: ''
  });

  const [showPay, setShowPay] = useState(false);
  const [isPaid, setIsPaid] = useState(false); // 新增：支付状态
  const [createdId, setCreatedId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    // 真正的数据库插入逻辑
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
    <div className="min-h-screen p-8 max-w-2xl mx-auto border-x-2 border-green-900 bg-black text-green-500">
      <h1 className="text-3xl font-bold mb-8 text-center animate-pulse">
        &gt;&gt;&gt; &gt; 副本实验室
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="space-y-4">
            <p className="text-yellow-500">I. 基础设定</p>
            <div>
              <label className="block text-xs opacity-50">你的昵称</label>
              <input name="creator_nick" required maxLength={10} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="你是谁？" />
            </div>
            <div>
              <label className="block text-xs opacity-50">受害者姓名</label>
              <input name="target_name" required maxLength={10} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="谁要倒霉了？" />
            </div>
            <div>
              <label className="block text-xs opacity-50">降临地点</label>
              <input name="site" required maxLength={20} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="例：前任的婚礼现场" />
            </div>
          </section>

          <section className="space-y-4">
            <p className="text-yellow-500">II. 羞耻设定</p>
            <div>
              <label className="block text-xs opacity-50">离谱瞬间 (Ta干过的蠢事)</label>
              <input name="lore" required maxLength={30} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="例：给共享单车说谢谢" />
            </div>
            <div>
              <label className="block text-xs opacity-50">Ta的心头好 (随身物品)</label>
              <input name="item" required maxLength={20} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="例：一个用了三年的外卖袋" />
            </div>
          </section>
        </div>

        <section className="space-y-4 pt-4 border-t border-green-900">
          <p className="text-yellow-500">III. 破防环节</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs opacity-50">那个东西 (Boss实体)</label>
              <input name="fear_boss" required maxLength={20} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="例：长着人脸的闹钟" />
            </div>
            <div>
              <label className="block text-xs opacity-50">破防小剧场 (Boss干啥)</label>
              <input name="fear_punish" required maxLength={40} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="例：在他耳边不停念咒" />
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-green-900">
          <p className="text-yellow-500">IV. 终极封印</p>
          <div>
            <label className="block text-xs opacity-50">通关提问 (只有Ta知道)</label>
            <input name="spell_question" required maxLength={30} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="例：你初中暗恋谁？" />
          </div>
          <div>
            <label className="block text-xs opacity-50">唯一答案 (暗号)</label>
            <input name="spell_answer" required maxLength={20} onChange={handleChange} className="w-full bg-black border-b border-green-500 p-1 text-green-500" placeholder="输入正确答案" />
          </div>
          <div>
            <label className="block text-xs opacity-50">通关后的真心话</label>
            <textarea name="final_message" required maxLength={100} onChange={handleChange} className="w-full bg-black border-2 border-green-900 p-2 h-20 text-green-500" placeholder="写点感人的或者更损的..." />
          </div>
        </section>

        <div className="pt-8 text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-black px-12 py-3 font-bold hover:bg-green-400 transition-all terminal-border disabled:opacity-50"
          >
            {loading ? '[ 正在刻录... ]' : '[ 封印该个体 ]'}
          </button>
        </div>
      </form>

      {showPay && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
          <div className="border-4 border-green-500 p-8 max-w-sm w-full text-center bg-black">
            <h2 className="text-xl mb-4 text-yellow-500">&gt;&gt;&gt; &gt; 能量契约</h2>

            {!isPaid ? (
              <>
                <div className="bg-white p-2 inline-block mb-4">
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-black text-xs p-4">
                    [ 此处放入你的收款码图片 ]
                  </div>
                </div>
                <p className="text-xs mb-6 opacity-70">主神系统检测到 0.66 元能量缺口。请支付以激活副本。</p>
                <button
                  onClick={() => setIsPaid(true)}
                  className="w-full bg-green-600 text-black py-2 font-bold hover:bg-green-400"
                >
                  我已支付
                </button>
              </>
            ) : (
              <div className="animate-in fade-in zoom-in duration-300">
                <p className="text-green-500 text-sm mb-4">契约已达成，副本链接已生成：</p>
                <div className="p-2 border border-green-500 bg-green-900/20 break-all font-mono text-xs mb-6">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/dungeon/{createdId}
                </div>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/dungeon/${createdId}`;
                    navigator.clipboard.writeText(url);
                    alert('链接已复制，去发给 Ta 吧！');
                  }}
                  className="w-full bg-yellow-600 text-black py-2 font-bold mb-2"
                >
                  点击复制链接
                </button>
              </div>
            )}

            <button onClick={() => setShowPay(false)} className="mt-4 text-gray-500 underline text-xs"> 返回 </button>
          </div>
        </div>
      )}
    </div>
  );
}