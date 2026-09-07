import {
  BulbOutlined,
  FileSearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ChatMessage, Conversation, PromptSuggestion } from "./types";

export const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "你好，我是你的运营助手。告诉我今天想推进什么，我会把目标拆成清晰可执行的下一步。",
    time: "刚刚",
  },
];

export const promptSuggestions: PromptSuggestion[] = [
  {
    title: "生成运营方案",
    description: "围绕新品或活动快速起草方案",
    icon: BulbOutlined,
  },
  {
    title: "分析经营数据",
    description: "从销售、库存中提炼关键结论",
    icon: FileSearchOutlined,
  },
  {
    title: "优化商品文案",
    description: "让卖点表达更准确、更有转化力",
    icon: ThunderboltOutlined,
  },
];

export const conversationList: Conversation[] = [
  { title: "新品发布会运营方案", time: "今天 10:42", active: true },
  { title: "本周商城数据复盘", time: "昨天 16:08", active: false },
  { title: "全屋智能产品卖点提炼", time: "9月 04日", active: false },
];

export const defaultThinkingStatus = "正在连接 Agent";
