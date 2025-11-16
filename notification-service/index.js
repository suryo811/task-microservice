import express from "express";
import amqp from "amqplib";

const app = express();

app.use(express.json());

let connection, channel;
// rabbitmq connection for consuming tasks
async function start(){
    try {
        connection = await amqp.connect("amqp://rabbitmq:5672");

        channel = await connection.createChannel();
        await channel.assertQueue("task_queue", {durable: true});
        console.log("Connected to RabbitMQ and asserted queue");
        channel.consume("task_queue", (message) => {
            const task = JSON.parse(message.content.toString());
            console.log("Received task:", task);
            channel.ack(message);
        });
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        throw error;
    }
}

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT} 🚀`);
    start().then(() => {
        console.log("RabbitMQ connected successfully")
    }).catch((err) => {
        console.error("Failed to connect to RabbitMQ:", err);
    })
})