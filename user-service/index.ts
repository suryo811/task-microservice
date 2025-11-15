import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());


// mongo connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/user";
mongoose.connect(mongoUri)
.then(() => {console.log("Connected to MongoDB")})
.catch((err) => {console.log(err)});


// define the user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
})

const User = mongoose.model("User", userSchema);

// route to create a new user
app.post("/users", async (req,res) => {
    const {name, email} = req.body;
    try {
        const user = await User.create({name,email});
        res.status(201).json({message: "User created successfully", user : {id: user._id, name: user.name, email: user.email}});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
})

// route to get all users
app.get("/users", async (req,res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
})

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port} 🚀`);
});