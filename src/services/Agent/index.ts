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

type AgentStreamChunk = {
  type?: string;
  data?: unknown;
  delta?: unknown;
  errorText?: unknown;
  message?: unknown;
  toolCallId?: unknown;
  toolName?: unknown;
  input?: unknown;
  output?: unknown;
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

const normalizeAgentChunk = (
  chunk: AgentStreamChunk,
  toolNames: Map<string, string>,
): AgentStreamEvent | null => {
  switch (chunk.type) {
    // Agent 当前返回 AI SDK UI Message Stream，前端内部继续使用稳定的领域事件。
    case "data-step": {
      const data = chunk.data;
      if (
        typeof data !== "object" ||
        data === null ||
        !("step" in data) ||
        typeof data.step !== "number"
      ) {
        return null;
      }
      return { type: "step", step: data.step };
    }
    case "text-delta":
      return typeof chunk.delta === "string"
        ? { type: "text", delta: chunk.delta }
        : null;
    case "tool-input-available": {
      const toolCallId =
        typeof chunk.toolCallId === "string" ? chunk.toolCallId : "";
      const toolName =
        typeof chunk.toolName === "string" ? chunk.toolName : undefined;
      if (toolCallId && toolName) {
        toolNames.set(toolCallId, toolName);
      }
      return {
        type: "tool-call",
        toolName,
        input: chunk.input,
      };
    }
    case "tool-output-available": {
      const toolCallId =
        typeof chunk.toolCallId === "string" ? chunk.toolCallId : "";
      const toolName = toolCallId ? toolNames.get(toolCallId) : undefined;
      if (toolCallId) {
        toolNames.delete(toolCallId);
      }
      return {
        type: "tool-result",
        toolName,
        output: chunk.output,
      };
    }
    case "data-continue":
      return { type: "continue" };
    case "data-max-steps":
      return { type: "max-steps" };
    case "finish":
      return { type: "done" };
    case "error": {
      const errorMessage =
        typeof chunk.errorText === "string"
          ? chunk.errorText
          : typeof chunk.message === "string"
            ? chunk.message
            : "Agent 处理请求失败";
      throw new Error(errorMessage);
    }

    // 兼容旧版 Agent SSE，便于前后端逐步发布。
    case "step":
    case "text":
    case "tool-call":
    case "tool-result":
    case "continue":
    case "max-steps":
    case "done":
      return chunk as AgentStreamEvent;
    default:
      return null;
  }
};

const parseSseEvent = (
  block: string,
  onEvent: (event: AgentStreamEvent) => void,
  toolNames: Map<string, string>,
) => {
  const data = block
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");

  if (!data) {
    return;
  }

  if (data === "[DONE]") {
    return;
  }

  let chunk: AgentStreamChunk;
  try {
    chunk = JSON.parse(data) as AgentStreamChunk;
  } catch {
    throw new Error("Agent 返回了无效的流式消息");
  }

  const event = normalizeAgentChunk(chunk, toolNames);
  if (event) {
    onEvent(event);
  }
};

const consumeSseStream = async (
  body: ReadableStream<Uint8Array>,
  onEvent: (event: AgentStreamEvent) => void,
  signal?: AbortSignal,
) => {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const toolNames = new Map<string, string>();

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });

      const blocks = buffer.split(SSE_EVENT_SEPARATOR);
      buffer = blocks.pop() || "";
      blocks.forEach((block) => parseSseEvent(block, onEvent, toolNames));

      if (done) {
        break;
      }
    }

    if (buffer.trim()) {
      parseSseEvent(buffer, onEvent, toolNames);
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
