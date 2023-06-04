import { HttpError } from "../models/HttpError.js";
import ChatModel from "../models/chat.js";
import UserModel from "../models/user.js";
import CarModel from "../models/car.js";
import { chatDateFormat } from "../utils/dateFormat.js";

export const createUpdateUsersChat = async (req, res, next) => {
  const { subject, users, message, car } = req.body;
  console.log(req.body);
  try {
    const existingChat = await ChatModel.findOne({
      users: { $all: users },
      car: car,
    });

    if (existingChat) {
      existingChat.messages.push(message);
      const savedChat = await existingChat.save();

      console.log(savedChat._id);
      res.json(savedChat._id);
    } else {
      const newChat = new ChatModel({
        subject,
        car,
        users,
        messages: [],
      });

      newChat.messages.push(message);
      const chatCar = await CarModel.findById(car);
      newChat.title = chatCar.details["Car Details"].Brand;
      newChat.image = chatCar.src[0];
      await newChat.save();

      const usersToUpdate = await UserModel.find({ _id: { $in: users } });
      usersToUpdate.forEach(async (user) => {
        user.chats.push(newChat._id);
        await user.save();
      });
      res.json(newChat._id);
    }
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't create chat", 500));
  }
};

export const getUserChatsInfo = async (req, res, next) => {
  const { userId } = req.params;

  let chats;

  try {
    chats = await UserModel.findById(userId).populate({ path: "chats" }).lean();
    chats = chats.chats.map((c) => {
      const unreadMessages = c.messages.filter(
        (m) => m.receiverId.toString() === userId && m.status === false
      ).length;
      return {
        id: c._id,
        image: c.image,
        title: c.title,
        subject: c.subject,
        unreadMessages: unreadMessages,
      };
    });
    res.json(chats);
  } catch (error) {
    return next(new HttpError("Can't load users chats"), 500);
  }
};

export const getChatById = async (req, res, next) => {
  const { chatId } = req.params;
  let messages;
  try {
    messages = await ChatModel.findById(chatId).select("messages").lean();
    messages = messages.messages.map((m) => ({
      ...m,
      chatId,
      id: m._id,
      timestamp: chatDateFormat(m.timestamp),
    }));
    res.json(messages);
  } catch (error) {
    return next(new HttpError("Cant load chat messages", 500));
  }
};

export const addChatMessage = async (req, res, next) => {
  const { text, chatId, senderId, receiverId } = req.body;

  try {
    const chat = await ChatModel.findById(chatId);

    if (!chat) {
      return next(new HttpError("Chat not found", 404));
    }

    let messageToReturn;
    let message;

    if (req.files) {
      const { image } = req.files;
      const newImage = Date.now().toString() + image.name;
      await image.mv("uploads/" + newImage);

      message = {
        text,
        textImage: newImage,
        senderId,
        receiverId,
      };
      console.log(message);
    } else {
      message = {
        text,
        senderId,
        receiverId,
      };
    }

    chat.messages.push(message);
    await chat.save();

    const addedMessage = chat.messages[chat.messages.length - 1];
    messageToReturn = {
      id: addedMessage._id,
      text: addedMessage.text,
      image: addedMessage.image,
      senderId: addedMessage.senderId,
      receiverId: addedMessage.receiverId,
      timestamp: chatDateFormat(addedMessage.timestamp),
      chatId: chat._id,
      textImage: addedMessage.textImage,
      status: addedMessage.status,
    };

    res.json(messageToReturn);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Cannot add a new message to the chat", 500));
  }
};

export const updateMessagesStatus = async (req, res, next) => {
  const { messageIds, chatId } = req.body;
  console.log(messageIds);
  try {
    const result = await ChatModel.updateMany(
      { _id: chatId, "messages._id": { $in: messageIds } },
      { $set: { "messages.$[elem].status": true } },
      { arrayFilters: [{ "elem._id": { $in: messageIds } }] }
    );
    if (result.modifiedCount === 0) {
      return next(new HttpError("Something went wrong", 500));
    } else {
      console.log("Completed");
    }
    res.json(messageIds);
  } catch (error) {
    return next(new HttpError("Cant update message status", 500));
  }
};

export const getUnreadMessagesLength = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId).populate("chats");

    let unreadMessagesCount = 0;

    user.chats.forEach((chat) => {
      chat.messages.forEach((message) => {
        if (message.receiverId.toString() === userId && !message.status) {
          unreadMessagesCount++;
        }
      });
    });
    console.log(unreadMessagesCount);
    res.json(unreadMessagesCount);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Cant get chats data", 500));
  }
};
