import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 模块级全局变量：用于在内存中缓存词库，避免每次请求都去读硬盘
let sensitiveWords: string[] | null = null;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ safe: true });
    }

    // ==========================================
    // 核心逻辑：读取本地敏感词库
    // ==========================================
    // 如果内存里还没有词库，就去读你刚上传的 txt 文件
    if (!sensitiveWords) {
      // 指向你的 src/sensitive_words.txt 文件
      const filePath = path.join(process.cwd(), 'sensitive_words.txt');

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        // 按行分割，去掉多余的空格和空行
        sensitiveWords = fileContent
          .split('\n')
          .map(word => word.trim())
          .filter(word => word.length > 0);
      } else {
        console.warn("⚠️ 找不到敏感词文件");
        sensitiveWords = [];
      }
    }

    // 开始遍历比对！如果用户填写的长文本里，包含了数组中的任何一个词，就触发警报
    const isLocalBad = sensitiveWords.some(word => text.includes(word));

    if (isLocalBad) {
      // 发现违禁词，直接驳回！
      return NextResponse.json({ safe: false, reason: '包含敏感词汇' });
    }

    // 安全通过
    return NextResponse.json({ safe: true });

  } catch (error) {
    console.error('审核接口报错:', error);
    // 出大错时默认放行，防止系统直接罢工
    return NextResponse.json({ safe: true });
  }
}