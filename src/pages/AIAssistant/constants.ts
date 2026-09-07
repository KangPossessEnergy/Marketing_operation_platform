import {
  BulbOutlined,
  FileSearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type {
  ChatMessage,
  ConversationItem,
  PromptSuggestion,
} from "./types";

export const initialWelcomeMessage: ChatMessage = {
  id: "welcome-msg",
  role: "assistant",
  content:
    "你好！我是您的营销运营智能助手。我可以帮您快速拆解营销目标、生成活动方案、分析经营数据或润色营销文案。告诉我您今天想推进什么？",
  time: "刚刚",
};

export const initialMessages: ChatMessage[] = [initialWelcomeMessage];

export const promptSuggestions: PromptSuggestion[] = [
  {
    key: "marketing-plan",
    label: "生成运营活动方案",
    description: "围绕中秋国庆大促或新品首发，快速起草全链路营销与裂变方案",
    icon: BulbOutlined,
  },
  {
    key: "data-analysis",
    label: "分析店铺经营数据",
    description: "从转化漏斗、GMV增长与库存周转率中洞察业务卡点与提效空间",
    icon: FileSearchOutlined,
  },
  {
    key: "copywriting",
    label: "优化爆款商品文案",
    description: "提炼核心差异化卖点，生成适合小红书/抖音等平台的高转化文案",
    icon: ThunderboltOutlined,
  },
];

export const initialConversationList: ConversationItem[] = [
  {
    key: "conv-1",
    label: "新品发布会全渠道运营方案",
    time: "今天 10:42",
  },
  {
    key: "conv-2",
    label: "本周商城各品类数据深度复盘",
    time: "昨天 16:08",
  },
  {
    key: "conv-3",
    label: "智能家居核心产品卖点提炼",
    time: "9月 04日",
  },
];

export const defaultThinkingStatus = "Agent 正在规划执行路径...";
