import mitt from "mitt";

export type RequestErrorEvent = {
  message: string;
  error: unknown;
};

export type SuccessMessageEvent = {
  message: string;
};

type AppEvents = {
  "request:error": RequestErrorEvent;
  "message:success": SuccessMessageEvent;
};

export const emitter = mitt<AppEvents>();

export const emitterChannel = {
  requestError: "request:error",
  successMessage: "message:success",
} as const;

export const publishSuccess = (message: string) => {
  emitter.emit(emitterChannel.successMessage, { message });
};
