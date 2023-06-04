import express from "express";

import {
  createUpdateUsersChat,
  getUserChatsInfo,
  getChatById,
  addChatMessage,
  updateMessagesStatus,
  getUnreadMessagesLength,
} from "../controllers/chat-controller.js";

export const chatRouter = express.Router();

chatRouter.patch("/update-messages-status", updateMessagesStatus);

chatRouter.post("/post-chat-message", createUpdateUsersChat);

chatRouter.get("/load-unread-messages-length/:userId", getUnreadMessagesLength);

chatRouter.get("/get-users-chat-info/:userId", getUserChatsInfo);

chatRouter.get("/get-chat-messages/:chatId", getChatById);

chatRouter.post("/send-chat-message", addChatMessage);
