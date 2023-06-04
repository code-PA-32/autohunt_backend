import express from "express";

import {
  getPopularNews,
  getAllNews,
  getNewsInfo,
  addNewsComment,
  deleteNewsComment,
  getNewsTags,
} from "../controllers/news-controller.js";

export const newsRouter = express.Router();

newsRouter.get("/popular-news", getPopularNews);

newsRouter.post("/get-all-news", getAllNews);

newsRouter.get("/news-info/:newsId", getNewsInfo);

newsRouter.post("/add-news-comment", addNewsComment);

newsRouter.post("/delete-news-comment", deleteNewsComment);

newsRouter.get("/tags-list", getNewsTags);
