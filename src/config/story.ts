export const getRouteConfig = (route: number, d: any) => {
  const cfg: any = {
    1: { text: `怎么可以这样对小猫！你的举动触怒了神灵，判你在此副本内永远不能摆脱【${d.fear_boss}】：`, actionBtn: `我命由我不由天，我跑！`, limit: 200, normalAlert: `你跑了1公里。`, limitAlert: `不能再跑了，会出人命的！`, advanceBtn: `给小猫表演才艺，试图赎罪`, talentType: 'cat' },
    2: { text: `小猫咂了咂嘴，它不想吃【${d.item}】。`, actionBtn: `再喂一次`, limit: 9999, isMoving: true, normalAlert: ['喵喵！', '喵喵喵！', '喵。'], limitAlert: ``, advanceBtn: `那我来表演段才艺吧`, talentType: 'cat' },
    3: { text: `小猫尴尬得直哆嗦，掉了一根毛~`, actionBtn: `再演一次`, limit: 200, normalAlert: `小猫又掉了一根毛~`, limitAlert: `停停停，小猫要秃了！`, advanceBtn: `那我来演点别的，表演点才艺吧`, talentType: 'cat' },
    4: { text: `人群四散奔逃，真是急急如丧家之犬，忙忙似漏网之鱼，恨不能肋生双翅，飞上天去。`, actionBtn: `我追！`, limit: 66, normalAlert: `追上了一个！`, limitAlert: `全追上了，你还想干什么。。。`, advanceBtn: `好无聊。把小猫叫回来给它表演才艺`, talentType: 'cat' },
    5: { text: `旁边的人觉得你很可怜，说，还是你留着吧`, actionBtn: `你什么意思？`, limit: 200, normalAlert: `你什么意思？`, limitAlert: `那人被你整无语了，转身离去。`, advanceBtn: `顺势开始卖艺，假装抱小猫也是表演的一部分`, talentType: 'crowd' },
    6: { text: `大家纷纷想起了自己的尴尬事，悻悻地走了`, actionBtn: `拉住一个人，说：只要你不尴尬，尴尬的就是别人！`, limit: 66, normalAlert: `好好好。`, limitAlert: `所有人都已经被你拉过了！`, advanceBtn: `惊喜地发现小猫并没走远，开始给它表演才艺`, talentType: 'cat' },
    7: { text: `小猫走到你旁边，开始八字形绕着你的脚走：`, actionBtn: `更害怕了，大叫起来`, limit: 9999, normalAlert: ['咕咕嘎嘎！', '呕吼！', '啊！', '嘻嘻嘻！', '古咕固！'], limitAlert: ``, advanceBtn: `我给你表演才艺你能不能放过我`, talentType: 'cat' },
    8: { text: `小猫绕过【${d.item}】，走到你旁边，开始八字形绕着你的脚走：`, actionBtn: `更害怕了，大叫起来`, limit: 9999, normalAlert: ['咕咕嘎嘎！', '呕吼！', '啊！', '嘻嘻嘻！', '古咕固！'], limitAlert: ``, advanceBtn: `我给你表演才艺你能不能放过我`, talentType: 'cat' },
    9: { text: `怎么可以这样对小猫！你的举动触怒了神灵，判你在此副本内永远不能摆脱【${d.fear_boss}】：`, actionBtn: `我命由我不由天，我跑！`, limit: 200, normalAlert: `你跑了1公里。`, limitAlert: `不能再跑了，会出人命的！`, advanceBtn: `给小猫表演才艺，试图赎罪`, talentType: 'cat' },
    10: { text: `小猫松开了口中的月亮`, actionBtn: `月亮是个什么味？我也尝尝。`, limit: 10, normalAlert: `月亮变小了一点。`, limitAlert: `月亮消失了！天上的人指着你说，看到了吗，那就是天狗食月。`, advanceBtn: `小猫真乖，给你表演个才艺吧`, talentType: 'cat' },
    11: { text: `小猫咂了咂嘴，它不想吃【${d.fear_boss}】。`, actionBtn: `再喂一次`, limit: 9999, isMoving: true, normalAlert: ['喵喵！', '喵喵喵！', '喵。'], limitAlert: ``, advanceBtn: `那我来表演段才艺吧`, talentType: 'cat' },
    12: { text: `小猫看了你一眼：喵喵喵？（那玩意能好吃吗？）`, actionBtn: `热情地递给小猫，你想吃吗？不给~`, limit: 100, normalAlert: `小猫扑了个空`, limitAlert: `小猫累了，求你住手吧。`, advanceBtn: `嘿嘿，被你发现了，给你表演个才艺吧`, talentType: 'cat' }
  };
  return cfg[route];
};

export const calculateSettlement = (route: number, count: number, sounds: any, d: any) => {
  if (count === 0) return { title: "专注者", desc: "没有四处徘徊，径直通关！" };
  switch (route) {
    case 1: case 9: return { title: "跑者", desc: `为了躲避【${d.fear_boss}】，跑了${count}公里，相当于${(count / 42).toFixed(2)}个马拉松！` };
    case 2: return { title: "喂猫者", desc: `在小猫明确表示不想吃【${d.item}】之后，又追着喂了${count}次！` };
    case 3: return { title: "梳子", desc: `在小猫面前表演了${count}次【${d.lore}】，令其尴尬得掉了${count}根毛~相当于梳毛一次！` };
    case 4: return { title: "追逐者", desc: `不懈追逐被【${d.fear_boss}】吓跑的人们，并成功追上了${count}人！` };
    case 5: return { title: "提问者", desc: `在别人拒绝你用【${d.item}】贿赂后，连续追问${count}个“你什么意思”！` };
    case 6: return { title: "号召者", desc: `当众表演【${d.lore}】，并拉住了试图离开的${count}人，号召他们和你一起不尴尬！` };
    case 7: case 8: return { title: "吼者", desc: `在被小猫吓到后大吼了：${sounds['咕咕嘎嘎！'] || 0}声咕咕嘎嘎！${sounds['呕吼！'] || 0}声呕吼！${sounds['啊！'] || 0}声啊！${sounds['嘻嘻嘻！'] || 0}声嘻嘻嘻！${sounds['古咕固！'] || 0}声古咕固！` };
    case 10: return { title: "天狗", desc: `和小猫抢月亮吃，并吃掉了${(count / 10).toFixed(1)}个月亮！` };
    case 11: return { title: "喂猫者", desc: `在小猫明确表示不想吃【${d.fear_boss}】之后，又追着喂了${count}次！` };
    case 12: return { title: "逗猫者", desc: `热情地邀请小猫吃【${d.item}】，又抽回来不给吃，害的小猫扑了${count}个空！` };
    default: return { title: "未知探索者", desc: "在宇宙边缘徘徊。" };
  }
};