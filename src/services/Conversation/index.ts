import request from "umi-request";

export interface ApiConversationItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

export interface ApiMessageItem {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ApiConversationDetail extends ApiConversationItem {
  messages: ApiMessageItem[];
}

const BASE_URL = "/api/conversations";

/**
 * 获取请求头（携带 JWT Token）
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/**
 * 1. 获取会话列表 (GET /api/conversations)
 */
export async function getConversationList(): Promise<ApiConversationItem[]> {
  return request(BASE_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

/**
 * 2. 创建新会话 (POST /api/conversations)
 */
export async function createConversation(title?: string): Promise<ApiConversationItem> {
  return request(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    data: {
      title: title || "新对话",
    },
  });
}

/**
 * 3. 获取指定会话详情与历史消息 (GET /api/conversations/:id)
 */
export async function getConversationDetail(id: string): Promise<ApiConversationDetail> {
  return request(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

/**
 * 4. 修改会话标题 (PATCH /api/conversations/:id)
 */
export async function updateConversationTitle(
  id: string,
  title: string,
): Promise<ApiConversationItem> {
  return request(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    data: { title },
  });
}

/**
 * 5. 追加保存一条消息记录 (POST /api/conversations/:id/messages)
 */
export async function addConversationMessage(
  conversationId: string,
  role: "user" | "assistant" | "system",
  content: string,
): Promise<ApiMessageItem> {
  return request(`${BASE_URL}/${conversationId}/messages`, {
    method: "POST",
    headers: getAuthHeaders(),
    data: { role, content },
  });
}

/**
 * 6. 删除指定会话 (DELETE /api/conversations/:id)
 */
export async function deleteConversationApi(id: string): Promise<any> {
  return request(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}
