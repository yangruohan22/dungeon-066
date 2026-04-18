import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

let sensitiveWords: string[] | null = null;
let loadError: string | null = null;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ safe: true });
    }

    // 1. 如果还没加载过词库，尝试加载
    if (!sensitiveWords) {
      // 自动兼容寻找词库文件的位置
      const rootPath = path.join(process.cwd(), 'sensitive_words.txt');
      const srcPath = path.join(process.cwd(), 'src', 'sensitive_words.txt');

      let filePath = '';
      if (fs.existsSync(rootPath)) filePath = rootPath;
      else if (fs.existsSync(srcPath)) filePath = srcPath;

      if (filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // 【核心修改】：删掉了那个坑爹的 `includes('')` 检测，直接无脑加载所有词！
        sensitiveWords = fileContent
          .split('\n')
          .map(word => word.trim())
          .filter(word => word.length > 1); // 过滤单字和空行

        console.log(`✅ 成功加载词库，共 ${sensitiveWords.length} 个词`);
        loadError = null;
      } else {
        loadError = `🚨 系统错误：找不到敏感词文件！请检查 Vercel 打包是否丢失了该文件。`;
        console.error(loadError);
      }
    }

    // 2. 如果文件真的找不到了，再抛出错误
    if (loadError) {
      return NextResponse.json({ safe: false, reason: loadError });
    }

    // 3. 遍历词库，查找是否命中
    const badWord = sensitiveWords?.find(word => text.includes(word));

    if (badWord) {
      console.log(`🚫 成功拦截违规词: [${badWord}]`);
      return NextResponse.json({ safe: false, reason: `触发敏感词汇：[${badWord}]，请修改！` });
    }

    return NextResponse.json({ safe: true });

  } catch (error) {
    console.error('审核接口报错:', error);
    return NextResponse.json({ safe: true });
  }
}