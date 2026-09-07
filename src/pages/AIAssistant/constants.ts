import {
  BulbOutlined,
  CompassOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  FileSearchOutlined,
  HeartOutlined,
  LineChartOutlined,
  ReadOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
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

// 参照参考图 Sitor 风格的 6 宫格药丸推荐问题
export const promptSuggestions: PromptSuggestion[] = [
  {
    key: "p1",
    label: '营销大模型到底怎么"思考"与执行的？',
    icon: BulbOutlined,
  },
  {
    key: "p2",
    label: "爆款转化率低？CBT 漏斗拆解法",
    icon: HeartOutlined,
  },
  {
    key: "p3",
    label: "新品首发全渠道冷启动与裂变策略",
    icon: RocketOutlined,
  },
  {
    key: "p4",
    label: "店铺大促复盘：GMV 增长与库存周转",
    icon: LineChartOutlined,
  },
  {
    key: "p5",
    label: "结构化文案生成：小红书爆款公式",
    icon: ReadOutlined,
  },
  {
    key: "p6",
    label: "智能运营 Agent 选型与工具链调用",
    icon: CompassOutlined,
  },
];

// 初始化会话列表（具有时间戳与时间相对显示，对应参考图侧边栏结构）
const now = Date.now();
const ONE_HOUR = 3600 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export const initialConversationList: ConversationItem[] = [
  {
    key: "conv-1",
    label: "新品发布会全渠道运营方案",
    time: "刚刚",
    timestamp: now - 5 * 60 * 1000,
    group: "新对话",
  },
  {
    key: "conv-2",
    label: "问到agent loop的原理 实际上...",
    time: "6 天前",
    timestamp: now - 6 * ONE_DAY,
    group: "新对话",
  },
  {
    key: "conv-3",
    label: "我如果做一个erp系统+把智能...",
    time: "6 天前",
    timestamp: now - 6 * ONE_DAY - 2 * ONE_HOUR,
    group: "新对话",
  },
  {
    key: "conv-4",
    label: "ts一般用@ai-sdk/openai 是 V...",
    time: "14 天前",
    timestamp: now - 14 * ONE_DAY,
    group: "新对话",
  },
  {
    key: "conv-5",
    label: "结构化表达与营销漏斗拆解...",
    time: "15 天前",
    timestamp: now - 15 * ONE_DAY,
    group: "新对话",
  },
  {
    key: "conv-6",
    label: "我有一个认知需要找你确定，AI...",
    time: "20 天前",
    timestamp: now - 20 * ONE_DAY,
    group: "新对话",
  },
];

export const defaultThinkingStatus = "Agent 正在规划执行路径...";
