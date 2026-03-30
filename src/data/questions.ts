export interface Question {
  id: number;
  text: string;
  guide?: string;
  dimension: 'E/I' | 'S/N' | 'T/F' | 'J/P';
}

export const questions: Question[] = [
  // E/I (10)
  { id: 1, text: "在陌生的社交场合，我能很快和大家打成一片", guide: "想象一下你刚推开聚会包厢的门，里面大部分人你都不认识...", dimension: 'E/I' },
  { id: 2, text: "周末时，我更想约朋友出去玩，去热闹的地方", dimension: 'E/I' },
  { id: 3, text: "遇到特别开心的事情，我会立刻想和身边人分享", dimension: 'E/I' },
  { id: 4, text: "遇到难题时，我更喜欢找人讨论来理清思路", dimension: 'E/I' },
  { id: 5, text: "和朋友聊天时，我偏好发语音或打电话，沟通效率高", dimension: 'E/I' },
  { id: 6, text: "我的兴趣爱好广泛，喜欢尝试各种新鲜事物", dimension: 'E/I' },
  { id: 7, text: "在一场热闹的派对中，我能感到真正地放松和充电", dimension: 'E/I' },
  { id: 8, text: "结交新朋友对我来说是一件很容易的事", dimension: 'E/I' },
  { id: 9, text: "我更喜欢开放热闹、随时可以交流的工作环境", dimension: 'E/I' },
  { id: 10, text: "表达观点时，我通常是边说边想，思维活跃", dimension: 'E/I' },

  // S/N (10)
  { id: 11, text: "接触新软件时，我会先看教程按部就班摸索", dimension: 'S/N' },
  { id: 12, text: "听课看文章时，我更关注具体的细节和实际应用", dimension: 'S/N' },
  { id: 13, text: "聊天时，我更喜欢聊最近发生的趣事和吃喝玩乐", dimension: 'S/N' },
  { id: 14, text: "描述物品时，我倾向于精确具体地说清楚", dimension: 'S/N' },
  { id: 15, text: "我的做事风格是脚踏实地，按部就班完成任务", dimension: 'S/N' },
  { id: 16, text: "评价电影小说时，我更看重剧情是否写实、逻辑严密", dimension: 'S/N' },
  { id: 17, text: "面对新问题时，我更愿意借鉴过去的成功经验", dimension: 'S/N' },
  { id: 18, text: "回忆过去，我更容易想起当时的具体细节", dimension: 'S/N' },
  { id: 19, text: "欣赏艺术作品时，我更看重技巧的精湛和写实感", dimension: 'S/N' },
  { id: 20, text: "规划未来时，我更关注眼前具体可行的目标", dimension: 'S/N' },

  // T/F (9)
  { id: 21, text: "朋友倾诉烦心事时，我会帮TA分析问题给建议", guide: "朋友半夜给你发微信说被老板骂了，你的第一反应是...", dimension: 'T/F' },
  { id: 22, text: "在团队中，我认为任务高效正确地完成最重要", dimension: 'T/F' },
  { id: 23, text: "评价行为时，我更看重是否合乎逻辑和客观标准", dimension: 'T/F' },
  { id: 24, text: "做决定时，我主要依靠客观事实和理性分析", dimension: 'T/F' },
  { id: 25, text: "面对批评，我会关注其是否合理，有则改之", dimension: 'T/F' },
  { id: 26, text: "我的沟通方式偏向直言不讳，就事论事", dimension: 'T/F' },
  { id: 27, text: "我认为聪明、理性、公正这些特质更值得赞赏", dimension: 'T/F' },
  { id: 28, text: "发生争执时，我倾向于一定要辩出个对错", dimension: 'T/F' },
  { id: 29, text: "看影视剧时，我更偏好烧脑悬疑或硬核纪录片", dimension: 'T/F' },

  // J/P (9)
  { id: 30, text: "旅游前，我会提前做好详细的攻略和行程", guide: "好不容易攒了几天假，终于可以出去玩了...", dimension: 'J/P' },
  { id: 31, text: "面对考试或工作交付日，我会提前规划按部就班完成", dimension: 'J/P' },
  { id: 32, text: "我的桌面和房间通常比较整洁，东西有固定位置", dimension: 'J/P' },
  { id: 33, text: "原定计划突然打乱时，我会感到焦虑和烦躁", dimension: 'J/P' },
  { id: 34, text: "我的工作学习方式是先完成任务再痛快地玩", dimension: 'J/P' },
  { id: 35, text: "做决定时，我倾向于尽快敲定不喜欢悬而未决", dimension: 'J/P' },
  { id: 36, text: "我严格遵守规则和日程表，这让我有安全感", dimension: 'J/P' },
  { id: 37, text: "去超市购物时，我会列好清单买完就走", guide: "推着购物车走进一家大型超市...", dimension: 'J/P' },
  { id: 38, text: "我更追求稳定有序、一切尽在掌握的生活", dimension: 'J/P' }
];