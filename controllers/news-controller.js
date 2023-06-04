import NewsModel from "../models/new.js";
import CommentModel from "../models/comment.js";
import { HttpError } from "../models/HttpError.js";
import { dateFormat } from "../utils/dateFormat.js";
import { convertTimestampToDate } from "../utils/dateFormat.js";

export const getPopularNews = async (req, res, next) => {
  let news;
  try {
    news = await NewsModel.find({ popular: true })
      .select("title text expert image time")
      .lean();
    news = news.map((n) => ({
      ...n,
      id: n._id,
      text: n.text.slice(0, 30) + "...",
      time: dateFormat(n.time),
    }));
  } catch (error) {
    console.log(error);
    return next(new HttpError());
  }
  console.log(news);
  res.json(news);
};

export const getAllNews = async (req, res, next) => {
  const filters = req.body;
  let newsList;
  console.log(filters.tags);
  const query = {};
  if (filters) {
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters.term) {
      query.$or = [
        { tags: { $elemMatch: { $regex: filters.term, $options: "i" } } },
        { title: { $regex: filters.term, $options: "i" } },
      ];
    }
  }
  try {
    newsList = await NewsModel.find(query)
      .select("title text expert image time tags comments")
      .lean();

    newsList = newsList.map((n) => ({
      ...n,
      time: convertTimestampToDate(n.time),
      length: n.comments.length,
      id: n._id,
      text: n.text.slice(0, 50) + "...",
    }));
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't load news", 500));
  }
  res.json(newsList);
};

export const getNewsInfo = async (req, res, next) => {
  let newsInfo;
  const newsId = req.params.newsId;
  console.log(newsId);
  try {
    newsInfo = await NewsModel.findById(newsId)
      .populate({ path: "comments" })
      .lean();

    newsInfo = {
      ...newsInfo,
      id: newsInfo._id,
      time: convertTimestampToDate(newsInfo.time),
    };
    console.log(newsInfo);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't load current news", 500));
  }
  res.json(newsInfo);
};

export const addNewsComment = async (req, res, next) => {
  const { text, userId, photo, name, newsId } = req.body;
  let commentToReturn;
  try {
    commentToReturn = await CommentModel({
      text,
      name,
      photo,
      userId,
    });
    commentToReturn = await commentToReturn.save();
    await NewsModel.findByIdAndUpdate(newsId, {
      $push: { comments: commentToReturn._id },
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't add new comment", 500));
  }
  res.json(commentToReturn);
};

export const deleteNewsComment = async (req, res, next) => {
  const { commentId, newsId } = req.body;
  console.log(req.body);
  try {
    await CommentModel.findByIdAndDelete(commentId);
    await NewsModel.findByIdAndUpdate(newsId, {
      $pull: { comments: commentId },
    });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't delete news comment", 500));
  }
  res.json(commentId);
};

export const getNewsTags = async (req, res, next) => {
  let tags;
  try {
    tags = await NewsModel.find().select("tags");
    tags = tags.map((t) => t.tags).flat();
    tags = Array.from(new Set(tags));
  } catch (error) {
    console.log(error);
    return next(new HttpError("Can't load tags", 500));
  }
  res.json(tags);
};
