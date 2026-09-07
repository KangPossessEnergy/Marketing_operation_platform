const AGENT_CHAT_URL = "/agent-api/chat";
const AGENT_HEALTH_URL = "/agent-api/health";

export type AgentStreamEvent = {
  type:
    | "step"
    | "text"
    | "tool-call"
    | "tool-result"
    | "continue"
    | "max-steps"
    | "done"
    | "error";
  step?: number;
  delta?: string;
  toolName?: string;
  input?: unknown;
  output?: unknown;
  message?: string;
};

type AgentChatParams = {
  sessionId: string;
  message: string;
  reset?: boolean;
};

type StreamAgentChatOptions = {
  signal?: AbortSignal;
  onEvent: (event: AgentStreamEvent) => void;
};

const SSE_EVENT_SEPARATOR = /\r?\n\r?\n/;

const getResponseError = async (response: Response) => {
  try {
    const payload = (await response.json()) as { error?: string; message?: string };
    return payload.error || payload.message;
  } catch {
    return undefined;
  }
};

const parseSseEvent = (
  block: string,
  onEvent: (event: AgentStreamEvent) => void,
) => {
  const data = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");

  if (!data) {
    return;
  }

  const event = JSON.parse(data) as AgentStreamEvent;
  if (event.type === "error") {
    throw new Error(event.message || "Agent 处理请求失败");
  }

  onEvent(event);
};

const consumeSseStream = async (
  body: ReadableStream<Uint8Array>,
  onEvent: (event: AgentStreamEvent) => void,
  signal?: AbortSignal,
) => {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      const blocks = buffer.split(SSE_EVENT_SEPARATOR);
      buffer = blocks.pop() || "";
      blocks.forEach((block) => parseSseEvent(block, onEvent));

      if (done) {
        break;
      }
    }

    if (buffer.trim()) {
      parseSseEvent(buffer, onEvent);
    }
  } finally {
    if (signal?.aborted) {
      await reader.cancel();
    }
    reader.releaseLock();
  }
};

export const checkAgentHealth = async (signal?: AbortSignal) => {
  const response = await fetch(AGENT_HEALTH_URL, {
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error("Agent 服务暂不可用");
  }
};

export const streamAgentChat = async (
  params: AgentChatParams,
  { signal, onEvent }: StreamAgentChatOptions,
) => {
  let response: Response;

  try {
    response = await fetch(AGENT_CHAT_URL, {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    throw new Error("无法连接 Agent 服务，请确认服务已启动");
  }

  if (!response.ok) {
    const responseError = await getResponseError(response);
    throw new Error(
      responseError || `Agent 服务请求失败（HTTP ${response.status}）`,
    );
  }

  if (!response.body) {
    throw new Error("当前浏览器无法读取 Agent 流式响应");
  }

  await consumeSseStream(response.body, onEvent, signal);
};
