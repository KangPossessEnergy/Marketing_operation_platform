import {
  AuditOutlined,
  BarChartOutlined,
  BulbOutlined,
  CalculatorOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
  SolutionOutlined,
  TeamOutlined,
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
    "你好！我是您的售前咨询与营销报价助手。我可以帮您快速解析客户需求、匹配 ERP 产品物料与库存交期、生成标准化报价方案，或针对竞争对手提供售前赢单话术。告诉我您当前正在推进的客户或项目？",
  time: "刚刚",
};

export const initialMessages: ChatMessage[] = [initialWelcomeMessage];

// 智能建议卡片（对齐 ERP+CRM 营销与售前咨询报价业务）
export const promptSuggestions: PromptSuggestion[] = [
  {
    key: "p1",
    category: "智能报价",
    label: "全屋智能三室两厅 35k 预算定制报价清单",
    description: "根据户型与预算，自动匹配设备选型、施工工时与毛利测算",
    icon: CalculatorOutlined,
    tone: "blue",
  },
  {
    key: "p2",
    category: "售前咨询",
    label: "高端别墅弱电智能化改造售前需求调研表",
    description: "梳理安防、调光、温控及影音中控的关键需求点与痛点挖掘",
    icon: SolutionOutlined,
    tone: "blue",
  },
  {
    key: "p3",
    category: "赢单攻坚",
    label: "面对竞品低价竞争，如何从服务与稳定性切入反驳？",
    description: "提炼核心差异化优势、客户顾虑拆解与高情商促单话术",
    icon: ThunderboltOutlined,
    tone: "orange",
  },
  {
    key: "p4",
    category: "库存与交期",
    label: "核对网关与智能开关实时库存及预计发货交期",
    description: "联动 ERP 供应链数据，评估项目备货周期与紧缺备件替换方案",
    icon: InboxOutlined,
    tone: "cyan",
  },
  {
    key: "p5",
    category: "CRM 商机",
    label: "已发报价单 3 天未回复？商机推进跟进策略与话术",
    description: "分析客户决策路径，制定温和且具价值感的主动跟进策略",
    icon: TeamOutlined,
    tone: "violet",
  },
  {
    key: "p6",
    category: "方案建议书",
    label: "生成商业展厅智能物联解决方案与技术配置建议",
    description: "自动化生成包含系统拓扑、设备清单与实施计划的标准方案",
    icon: FileDoneOutlined,
    tone: "blue",
  },
];

// 初始化会话列表（具有时间戳与时间相对显示，对齐 ERP/CRM 业务会话）
const now = Date.now();
const ONE_HOUR = 3600 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

export const initialConversationList: ConversationItem[] = [
  {
    key: "conv-1",
    label: "全屋智能三室两厅 35k 方案报价单",
    time: "刚刚",
    timestamp: now - 5 * 60 * 1000,
    group: "近期方案",
  },
  {
    key: "conv-2",
    label: "某地产样板间售前技术答疑纪要",
    time: "6 天前",
    timestamp: now - 6 * ONE_DAY,
    group: "近期方案",
  },
  {
    key: "conv-3",
    label: "高端别墅客户智能照明方案与毛利分析",
    time: "6 天前",
    timestamp: now - 6 * ONE_DAY - 2 * ONE_HOUR,
    group: "近期方案",
  },
  {
    key: "conv-4",
    label: "核心传感器缺货替代料选型与交期评估",
    time: "14 天前",
    timestamp: now - 14 * ONE_DAY,
    group: "历史跟进",
  },
  {
    key: "conv-5",
    label: "商业办公智能中控竞标方案准备",
    time: "15 天前",
    timestamp: now - 15 * ONE_DAY,
    group: "历史跟进",
  },
  {
    key: "conv-6",
    label: "跟进大客户采购预算审批推进策略",
    time: "20 天前",
    timestamp: now - 20 * ONE_DAY,
    group: "历史跟进",
  },
];

export const defaultThinkingStatus = "售前助手正在检索产品库与报价规则...";
