import express from "express";
import commentsController from "../controllers/commentsController";
import authMiddleware from "../middlewares/authMiddleware";

export const commentRouter = express.Router();

commentRouter.get("/", commentsController.getAll.bind(commentsController));
commentRouter.get("/:id", commentsController.getById.bind(commentsController));
commentRouter.post(
  "/",
  authMiddleware,
  commentsController.create.bind(commentsController),
);
commentRouter.put(
  "/:id",
  authMiddleware,
  commentsController.update.bind(commentsController),
);
commentRouter.delete(
  "/:id",
  authMiddleware,
  commentsController.delete.bind(commentsController),
);
