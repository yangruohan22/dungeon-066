'use client';
import { useState } from 'react';

export default function LegalFooter() {
  const [modal, setModal] = useState<string | null>(null);

  // 弹窗内容配置
  const modals: Record<string, { title: string; content: React.ReactNode }> = {
    disclaimer: {
      title: '免责声明',
      content: (
        <div className="space-y-4 text-slate-600 leading-relaxed text-left text-sm md:text-base">
          <p>1. 本网站（地球Online·专属人生副本）为 UGC（用户生成内容）纯娱乐工具。页面中展示的所有具体文案、人名、事件等，均由匿名用户自行填写生成，系统仅提供模板与排版服务。</p>
          <p>2. 用户填写的任何内容均不代表本站立场。本站不对内容的真实性、准确性、合法性承担任何责任。</p>
          <p>3. 因传播、分享本站生成的副本页面所引发的一切法律纠纷（包括但不限于名誉权、隐私权侵犯），均由内容生成者及传播者自行承担，本站概不负责。</p>
        </div>
      )
    },
    privacy: {
      title: '用户协议与隐私政策',
      content: (
        <div className="space-y-4 text-slate-600 leading-relaxed text-left text-sm md:text-base">
          <p><strong>【用户协议】</strong><br/>在使用本服务前，您必须承诺不输入任何涉黄、涉政、涉黑、暴恐、侮辱诽谤或侵犯他人合法权益的违规信息。一经发现，本站有权无条件永久封禁相关数据并配合有关部门调查。</p>
          <p><strong>【隐私政策】</strong><br/>1. 我们仅收集您在表单中主动填写的文本数据（如代号、事件、物品等），该数据仅用于生成您的专属娱乐副本。<br/>2. 我们郑重承诺，绝不会将您的输入数据出售或泄露给任何第三方机构。<br/>3. 本站绝不会主动获取您的设备敏感信息、地理位置或个人身份证明。</p>
        </div>
      )
    },
    appeal: {
      title: '侵权与违规申诉',
      content: (
        <div className="space-y-4 text-slate-600 leading-relaxed text-left text-sm md:text-base">
          <p>我们坚决抵制任何形式的网络暴力、恶意造谣与侵权行为。</p>
          <p>如果您发现本站生成的某个副本页面中包含侵犯您合法权益（如名誉权、隐私权），或包含其他违法违规内容，请立即通过以下方式联系我们：</p>
          <div className="bg-slate-100 p-4 rounded-xl border-2 border-slate-200 font-bold text-slate-800 text-center my-4">
            申诉邮箱：bazinga66@126.com <br/>
          </div>
          <p><strong>申诉须知：</strong>请在邮件中附上【违规副本的完整链接】以及相关的【侵权证明材料】。我们将在核实情况后的 24 小时内对违规页面进行封禁与永久删除处理。</p>
        </div>
      )
    }
  };

  return (
    <>
      {/* 底部链接区 */}
      <div className="w-full text-center py-6 text-slate-400 text-xs md:text-sm font-bold flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-auto z-10 relative">
        <button onClick={() => setModal('disclaimer')} className="hover:text-slate-600 transition-colors">免责声明</button>
        <span className="hidden sm:inline">|</span>
        <button onClick={() => setModal('privacy')} className="hover:text-slate-600 transition-colors">用户协议与隐私政策</button>
        <span className="hidden sm:inline">|</span>
        <button onClick={() => setModal('appeal')} className="hover:text-red-400 transition-colors">侵权与违规申诉</button>
      </div>

      {/* 弹窗遮罩区 */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white max-w-lg w-full rounded-2xl shadow-[8px_8px_0_#000] overflow-hidden animate-in zoom-in duration-300 border-4 border-slate-900">

            {/* 弹窗标题 */}
            <div className="bg-slate-900 text-white p-4 text-center font-black text-xl flex justify-between items-center">
              <span>[ {modals[modal].title} ]</span>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white text-3xl leading-none transition-colors">&times;</button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
              {modals[modal].content}
            </div>

            {/* 弹窗底部按钮 */}
            <div className="p-4 bg-slate-50 border-t-4 border-slate-900 text-center">
              <button onClick={() => setModal(null)} className="w-full bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-lg active:translate-y-1 shadow-[4px_4px_0_#475569] active:shadow-none transition-all">
                我已了解
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}