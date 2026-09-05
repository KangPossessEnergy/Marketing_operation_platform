import React, { useEffect, type ReactNode } from "react";
import { message } from "antd";
import {
  emitter,
  emitterChannel,
  type RequestErrorEvent,
  type SuccessMessageEvent,
} from "@/utils/mitt";

const RequestErrorListener: React.FC = () => {
  useEffect(() => {
    const handleRequestError = ({ message: errorMessage }: RequestErrorEvent) => {
      message.error(errorMessage);
    };

    emitter.on(emitterChannel.requestError, handleRequestError);
    return () => {
      emitter.off(emitterChannel.requestError, handleRequestError);
    };
  }, []);

  return null;
};

const SuccessMessageListener: React.FC = () => {
  useEffect(() => {
    const handleSuccessMessage = ({ message: successMessage }: SuccessMessageEvent) => {
      message.success(successMessage);
    };

    emitter.on(emitterChannel.successMessage, handleSuccessMessage);
    return () => {
      emitter.off(emitterChannel.successMessage, handleSuccessMessage);
    };
  }, []);

  return null;
};

export function rootContainer(container: ReactNode) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(RequestErrorListener),
    React.createElement(SuccessMessageListener),
    container
  );
}
