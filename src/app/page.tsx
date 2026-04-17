'use client';
import { useRouter } from 'next/navigation';
import LegalFooter from '@/components/LegalFooter';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-[#f1f5f9] flex flex-col items-center justify-center p-4 font-sans relative">

      <div className="bg-white max-w-2xl w-full border-4 border-slate-900 rounded-3xl shadow-[12px_12px_0_#1e293b] p-10 md:p-16 text-center animate-in zoom-in duration-700 relative overflow-hidden my-auto">

        {/* 背景装饰 */}
        <div className="absolute -top-10 -right-10 text-9xl opacity-10 transform rotate-12 pointer-events-none">
          🌍
        </div>

        <div className="text-7xl md:text-8xl mb-8 animate-bounce">
          🌍
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-widest">
          地球Online
        </h1>
        <h2 className="text-2xl font-bold text-blue-600 mb-8 tracking-wider">
          专属人生副本生成系统
        </h2>

        <div className="border-t-4 border-dashed border-slate-200 my-8"></div>

        <div className="space-y-4 text-left bg-slate-50 border-4 border-slate-900 p-6 rounded-2xl mb-10">
          <p className="text-lg font-bold text-slate-600">
            <span className="text-red-500 mr-2">⚠️</span> 警告：本系统没什么杀伤力！
          </p>
          <p className="text-md font-bold text-slate-500 leading-relaxed">
            在这里，你可以为你的损友量身定制一场天马行空的副本冒险。对朋友了解越深，制作出的副本越好玩哦~
          </p>
        </div>

        <button
          onClick={() => router.push('/create')}
          className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-2xl hover:bg-blue-600 transition-all shadow-[6px_6px_0_#334155] active:translate-y-1 active:shadow-none"
        >
          [ 开启炼丹 ]
        </button>

        <p className="mt-8 text-sm font-bold text-slate-400">
          Powered by {new Date().getFullYear()} Bazinga制造局
        </p>
      </div>

      {/* 将合规页脚放在这里 */}
      <LegalFooter />
    </main>
  );
}