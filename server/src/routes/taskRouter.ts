import { Router } from "express";

const taskRouter = Router();

taskRouter.get("/", (req, res) => {
  res.send("Hello from task router");
});

taskRouter.get("/task", (req, res) => {
  res.send("Get All Tasks");
});

taskRouter.post("/task", (req, res) => {
  res.send("Create a Task");
});

taskRouter.put("/task/:id", (req, res) => {
  res.send("Update a Task");
});

taskRouter.delete("/task/:id", (req, res) => {
  res.send("Delete a Task");
});