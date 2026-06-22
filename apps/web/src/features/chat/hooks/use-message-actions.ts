"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import type { Message } from "../types";
import { buildReplyReference } from "../utils";
import { useChat } from "./use-chat";

export function useMessageActions() {
  const { users, currentUser, deleteMessage, setPendingReply, startForward } =
    useChat();

  const replyTo = useCallback(
    (message: Message) => {
      setPendingReply(buildReplyReference(message, users));
    },
    [setPendingReply, users],
  );

  const forward = useCallback(
    (message: Message) => {
      startForward(message);
    },
    [startForward],
  );

  const copy = useCallback(async (message: Message) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(message.content);
        toast.success("Message copied to clipboard");
      }
    } catch {
      toast.error("Couldn't copy message");
    }
  }, []);

  const remove = useCallback(
    (message: Message) => {
      deleteMessage(message.id);
      toast.success("Message deleted");
    },
    [deleteMessage],
  );

  const canDelete = useCallback(
    (message: Message) => message.authorId === currentUser.id,
    [currentUser],
  );

  return {
    replyTo,
    forward,
    copy,
    remove,
    canDelete,
  };
}
