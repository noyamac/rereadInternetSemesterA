import { Request, Response } from "express";
import { Model, Document } from "mongoose";

class BaseController<T extends Document> {
  model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async getAll(req: Request, res: Response) {
    const filter = req.query;

    try {
      if (filter) {
        const data = await this.model.find(filter);
        res.json(data);
      } else {
        const data = await this.model.find();
        res.json(data);
      }
    } catch (err) {
      res.status(500).send({ error: "error recieving data", err });
    }
  }

  async getById(req: Request, res: Response) {
    const id: string = req.params.id;
    try {
      const data = await this.model.findById(id);
      if (!data) {
        res.status(404).send("Data not found");
      } else {
        res.json(data);
      }
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }

  async create(req: Request, res: Response) {
    const newData = req.body;

    try {
      const response = await this.model.create(newData);
      res.status(201).json(response);
    } catch (err) {
      res.status(500).send({ error: "error creating data", err });
    }
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const response = await this.model.findByIdAndDelete(id);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const updatedData = req.body;
    try {
      const response = await this.model.findByIdAndUpdate(id, updatedData, {
        new: true,
      });
      res.json(response);
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }
}
export default BaseController;
