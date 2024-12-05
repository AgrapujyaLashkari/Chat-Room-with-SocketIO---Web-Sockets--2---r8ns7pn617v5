// // importing required modules
// const express = require('express');
// const path = require('path');
// require('dotenv').config();

// // creating an express app, then an http server, which is then passed to socketio
// const app = express();
// const http = require('http').createServer(app);
// const io = require("socket.io")(http);

// // This will contain all the users
// const users = [];

// // Setting up of port 
// const port = process.env.PORT || 3000;
// app.use(express.static(path.join(__dirname, 'public')));

// /////////////////////// IMPLEMENT BELOW STEPS //////////////////////

// // Setup io to listen to new connection and then inside its callback implement

//   // Send {username:"Bot", message:"Welcome to chatbox"} about "message" to current socket only

//   // Listen for "userJoin" from client to get new username, add him to users array as {id: socket.id, username: username},
//   // send {username:"Bot",message:`${username} has joined the chat`} about "message" to everyone except current socket and
//   // send updated users array about "updateUsers" to every socket

//   // Listen for "disconnect", find the username from users array matching socket.id and 
//   // send {username:"Bot",message:`${username} has left the chat`} about "message" to everyone except current socket
//   // also remove the user from users array send updated users array about "updateUsers" to every socket

//   // Listen for "chatMessage" for any message and send {username:msg.username,message:msg.message} about "message" to every socket


// let server = http.listen(port, () => console.log(`Server Running at port ${port}`));

// if (process.env.NODE_ENV === 'testing') {
//   console.log('will kill the server after 30sec')
//   setTimeout(() => {
//     server.close()
//   }, 60000);

// }

// exports.server = server





// Importing required modules
const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// This will contain all the users
const users = [];

// Setting up the port
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));

// Setup io to listen to new connections
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Send welcome message from Bot to the current socket
  socket.emit("message", { username: "Bot", message: "Welcome to chatbox" });

  // Listen for "userJoin" from the client
  socket.on("userJoin", (username) => {
    users.push({ id: socket.id, username });
    console.log(`${username} has joined`);

    // Notify all except the current socket
    socket.broadcast.emit("message", { username: "Bot", message: `${username} has joined the chat` });

    // Send the updated users array to all sockets
    io.emit("updateUsers", users);
  });

  // Listen for "disconnect"
  socket.on("disconnect", () => {
    const userIndex = users.findIndex((user) => user.id === socket.id);
    if (userIndex !== -1) {
      const username = users[userIndex].username;
      users.splice(userIndex, 1);

      console.log(`${username} has left`);

      // Notify everyone about the user leaving
      socket.broadcast.emit("message", { username: "Bot", message: `${username} has left the chat` });

      // Send the updated users array to all sockets
      io.emit("updateUsers", users);
    }
  });

  // Listen for "chatMessage" from the client
  socket.on("chatMessage", (msg) => {
    io.emit("message", { username: msg.username, message: msg.message });
  });
});

// Start the server
let server = http.listen(port, () => console.log(`Server Running at port ${port}`));

if (process.env.NODE_ENV === "testing") {
  console.log("Will kill the server after 30 sec");
  setTimeout(() => {
    server.close();
  }, 60000);
}

exports.server = server;
