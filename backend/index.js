import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

// Handle incoming connections from clients
io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    // Listen for joining a room
    socket.on("join_room", (data) => {
        socket.join(data.room);  // Join the room
        console.log(`User ${socket.id} joined room ${data.room}`);
    });

    // Listen for the 'send_message' event
    socket.on("send_message", (data) => {
        console.log(data);
        // save to db
        
        // Emit message to all clients in the specified room
        io.to(data.room).emit("receive_message", data);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
