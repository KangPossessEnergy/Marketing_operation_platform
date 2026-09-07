import React from "react";
import { message } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  BulbOutlined,
  HomeOutlined,
  RightOutlined,
  ShopOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useNavigate } from "umi";
import "./index.less";

type WorkbenchCard = {
  title: string;
  description: string;
  icon: React.ReactNode;
  tone: string;
};

const workbenchCards: WorkbenchCard[] = [
  {
    title: "方案设计",
    description: "高效设计产品方案",
    icon: <SolutionOutlined />,
    tone: "blue",
  },
  {
    title: "进销存数据统计",
    description: "进销存数据统计",
    icon: <BarChartOutlined />,
    tone: "cyan",
  },
  {
    title: "家庭管理",
    description: "交付管理家庭信息",
    icon: <HomeOutlined />,
    tone: "violet",
  },
  {
    title: "商城运营",
    description: "掌握商品经营动态",
    icon: <ShopOutlined />,
    tone: "orange",
  },
];

const announcements = [
  { title: "FY27天猫精灵全屋智能产品策略发布", date: "2026-08-13 15:18:47" },
  { title: "FY27天猫精灵全屋智能渠道政策更新", date: "2026-06-08 16:59:31" },
  { title: "FY27天猫精灵全屋智能服务规范通知", date: "2026-05-06 16:33:30" },
];

const shortcuts = [
  { title: "商品中心", description: "管理商品与库存", icon: <AppstoreOutlined /> },
  { title: "订单管理", description: "查看订单进度", icon: <ShopOutlined /> },
  { title: "客户管理", description: "维护客户信息", icon: <SolutionOutlined /> },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isOpeningAssistant, setIsOpeningAssistant] = React.useState(false);
  const [portalOrigin, setPortalOrigin] = React.useState({ x: 0, y: 0 });

  const openModule = (title: string) => {
    message.info(`${title}模块正在建设中`);
  };

  const openAssistant = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isOpeningAssistant) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setPortalOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setIsOpeningAssistant(true);

    window.setTimeout(() => {
      navigate("/ai-assistant");
    }, 720);
  };

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__copy">
          <span className="home-hero__eyebrow">Tmall Genie · Home Intelligence</span>
          <h1 id="home-title">商城工作台</h1>
          <p>欢迎回来，187****9192。这里是你的全屋智能运营中心。</p>
        </div>
        <div className="home-hero__status">
          <span className="home-hero__status-dot" />
          <span>系统运行正常</span>
          <span className="home-hero__status-date">2026年09月05日</span>
        </div>
      </section>

      <section className="assistant-entry" aria-labelledby="assistant-entry-title">
        <div className="assistant-entry__grid" aria-hidden="true" />
        <div className="assistant-entry__scanline" aria-hidden="true" />
        <div className="assistant-entry__content">
          <div className="assistant-entry__eyebrow">
            <span className="assistant-entry__signal" />
            <span>AI OPERATING CONSOLE</span>
            <span className="assistant-entry__eyebrow-line" />
            <span>READY</span>
          </div>
          <h2 id="assistant-entry-title">把运营灵感，交给 AI 接力</h2>
          <p>从洞察、策略到执行，让每一次业务动作都更快找到下一步。</p>
          <button className="assistant-entry__button" type="button" onClick={openAssistant}>
            <span className="assistant-entry__button-icon">
              <BulbOutlined />
            </span>
            <span className="assistant-entry__button-copy">
              <strong>进入 AI 助手</strong>
              <small>打开专属智能工作台</small>
            </span>
            <span className="assistant-entry__button-arrow" aria-hidden="true">
              <RightOutlined />
            </span>
          </button>
        </div>
        <div className="assistant-entry__orbit" aria-hidden="true">
          <span className="assistant-entry__orbit-ring assistant-entry__orbit-ring--outer" />
          <span className="assistant-entry__orbit-ring assistant-entry__orbit-ring--middle" />
          <span className="assistant-entry__orbit-ring assistant-entry__orbit-ring--inner" />
          <span className="assistant-entry__core">
            <BulbOutlined />
          </span>
          <span className="assistant-entry__orbit-node assistant-entry__orbit-node--one" />
          <span className="assistant-entry__orbit-node assistant-entry__orbit-node--two" />
          <span className="assistant-entry__orbit-node assistant-entry__orbit-node--three" />
        </div>
      </section>

      <section className="home-section home-section--workbench" aria-labelledby="workbench-title">
        <div className="home-section__heading">
          <div>
            <span className="section-kicker">WORKBENCH</span>
            <h2 id="workbench-title">工作台</h2>
          </div>
          <button className="text-action" type="button" onClick={() => message.info("更多工作台功能正在建设中")}>
            查看更多 <RightOutlined />
          </button>
        </div>
        <div className="workbench-grid">
          {workbenchCards.map((card) => (
            <button className="workbench-card" key={card.title} type="button" onClick={() => openModule(card.title)}>
              <span className={`workbench-card__icon workbench-card__icon--${card.tone}`}>{card.icon}</span>
              <span className="workbench-card__title">{card.title}</span>
              <span className="workbench-card__description">{card.description}</span>
              <RightOutlined className="workbench-card__arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className="home-section announcement-section" aria-labelledby="announcement-title">
        <div className="home-section__heading">
          <div>
            <span className="section-kicker">LATEST UPDATES</span>
            <h2 id="announcement-title">信息公告</h2>
          </div>
          <button className="text-action" type="button" onClick={() => message.info("公告列表正在建设中")}>
            查看更多 <RightOutlined />
          </button>
        </div>
        <div className="announcement-grid">
          {announcements.map((announcement) => (
            <button className="announcement-card" key={announcement.date} type="button" onClick={() => openModule("公告详情")}>
              <span className="announcement-card__title">{announcement.title}</span>
              <span className="announcement-card__meta">{announcement.date}</span>
              <RightOutlined className="announcement-card__arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className="home-section shortcut-section" aria-labelledby="shortcut-title">
        <div className="home-section__heading">
          <div>
            <span className="section-kicker">FREQUENTLY USED</span>
            <h2 id="shortcut-title">快捷入口</h2>
          </div>
        </div>
        <div className="shortcut-grid">
          {shortcuts.map((shortcut) => (
            <button className="shortcut-item" key={shortcut.title} type="button" onClick={() => openModule(shortcut.title)}>
              <span className="shortcut-item__icon">{shortcut.icon}</span>
              <span>
                <strong>{shortcut.title}</strong>
                <small>{shortcut.description}</small>
              </span>
              <RightOutlined />
            </button>
          ))}
        </div>
      </section>

      {isOpeningAssistant && (
        <div
          className="assistant-transition"
          style={
            {
              "--transition-x": `${portalOrigin.x}px`,
              "--transition-y": `${portalOrigin.y}px`,
            } as React.CSSProperties
          }
          role="status"
          aria-live="polite"
        >
          <div className="assistant-transition__ring assistant-transition__ring--one" />
          <div className="assistant-transition__ring assistant-transition__ring--two" />
          <div className="assistant-transition__ring assistant-transition__ring--three" />
          <div className="assistant-transition__flash" />
          <div className="assistant-transition__label">
            <span className="assistant-transition__label-mark">
              <BulbOutlined />
            </span>
            <span>正在唤醒 AI 工作台</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
