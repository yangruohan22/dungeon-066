'use client';
import { useRouter } from 'next/navigation';
import LegalFooter from '@/components/LegalFooter';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center justify-center p-4 font-sans relative">

      {/* 【响应式】：缩小了手机端的 padding (p-6) 和 最大宽度 */}
      <div className="bg-white max-w-2xl w-full border-4 border-slate-900 rounded-3xl shadow-[8px_8px_0_#1e293b] md:shadow-[12px_12px_0_#1e293b] p-6 sm:p-10 md:p-16 text-center animate-in zoom-in duration-700 relative overflow-hidden my-auto">

        {/* 背景装饰 */}
        <div className="absolute -top-10 -right-10 text-8xl md:text-9xl opacity-10 transform rotate-12 pointer-events-none">
          🌍
        </div>

        {/* 【响应式】：缩小了手机端图标 */}
        <div className="text-6xl sm:text-7xl md:text-8xl mb-6 md:mb-8 animate-bounce">
          🌍
        </div>

        {/* 【响应式】：缩小了手机端标题字体 */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 md:mb-4 tracking-widest">
          地球Online
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-6 md:mb-8 tracking-wider">
          专属人生副本生成系统
        </h2>

        <div className="border-t-4 border-dashed border-slate-200 my-6 md:my-8"></div>

        {/* 【响应式】：缩小了警告框的 padding 和文字 */}
        <div className="space-y-3 md:space-y-4 text-left bg-slate-50 border-4 border-slate-900 p-4 md:p-6 rounded-2xl mb-8 md:mb-10">
          <p className="text-base md:text-lg font-bold text-slate-600">
            <span className="text-red-500 mr-2">⚠️</span> 警告：本系统极具杀伤力！
          </p>
          <p className="text-sm md:text-base font-bold text-slate-500 leading-relaxed">
            在这里，你可以为你的朋友量身定制一场天马行空的副本冒险。对朋友越了解，生成的副本越有趣哦~
          </p>
        </div>

        {/* 【响应式】：缩小了按钮的高度和字号 */}
        <button
          onClick={() => router.push('/create')}
          className="w-full bg-slate-900 text-white py-4 md:py-6 rounded-2xl font-black text-xl md:text-2xl hover:bg-blue-600 transition-all shadow-[4px_4px_0_#334155] md:shadow-[6px_6px_0_#334155] active:translate-y-1 active:shadow-none"
        >
          [ 开启炼丹 ]
        </button>

        <p className="mt-6 md:mt-8 text-xs md:text-sm font-bold text-slate-400">
          Powered by {new Date().getFullYear()} Bazinga制造局
        </p>
      </div>

      <LegalFooter />
    </main>
  );
}