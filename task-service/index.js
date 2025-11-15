import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// mongo connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/task";
mongoose.connect(mongoUri)
.then(() => {console.log("Connected to MongoDB")})
.catch((err) => {console.log(err)});


// define the task schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    createdAt: {type: Date, default: Date.now},
})

const Task = mongoose.model("Task", taskSchema);

// route to create a new task
app.post("/tasks", async (req,res) => {
    const {title, description, userId} = req.body;
    try {
        const task = await Task.create({title, description});
        res.status(201).json({message: "Task created successfully", task : {id: task._id, title: task.title, description: task.description, userId: task.userId}});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
})

// route to get all tasks
app.get("/tasks", async (req,res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
})

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Task Service is running on port ${PORT} 🚀`);
});