// // Socket io on client side
// const socket = io();

// // Refer to chatbox.html & open it in browser to know what they represent
// const usersList = document.querySelector(".users-name");
// const chatForm = document.getElementById("message-form");
// const messageInput = document.querySelector("#msg");
// const messages = document.querySelector(".messages");

// // Getting username from index.html, here qs is a library to parse querystring in url 
// const {username} = Qs.parse(location.search, {ignoreQueryPrefix: true});

// /////////////////////// IMPLEMENT BELOW STEPS //////////////////////

// // Send username about "userJoin" to server 

// // Listen for "updateUsers" from server and update usersList with new list of users, each user should be a li element containing username.

// // Listen for "message" from server and add new msg to messages, each message is a div element with class "message" 
// // containing 2 paragraphs, one with class "meta" containing username & other with class "text" containing message.

// // When a user submit a message in chatForm send {username: username, message: messageInput.value } about chatMessage to server 




// Socket.io on client side
const socket = io();

// Refer to chatbox.html & open it in the browser to know what they represent
const usersList = document.querySelector(".users-name");
const chatForm = document.getElementById("message-form");
const messageInput = document.querySelector("#msg");
const messages = document.querySelector(".messages");

// Getting username from index.html
const { username } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Send username about "userJoin" to server
socket.emit("userJoin", username);

// Listen for "updateUsers" from server and update usersList with the new list of users
socket.on("updateUsers", (users) => {
  usersList.innerHTML = ""; // Clear the current list
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.username;
    usersList.appendChild(li);
  });
});

// Listen for "message" from the server and add the new message to the messages
socket.on("message", (data) => {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  const meta = document.createElement("p");
  meta.classList.add("meta");
  meta.textContent = data.username;

  const text = document.createElement("p");
  text.classList.add("text");
  text.textContent = data.message;

  messageElement.appendChild(meta);
  messageElement.appendChild(text);

  messages.appendChild(messageElement);
  messages.scrollTop = messages.scrollHeight; // Scroll to the latest message
});

// When a user submits a message in chatForm, send it to the server
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;

  if (message.trim()) {
    socket.emit("chatMessage", { username, message });
    messageInput.value = ""; // Clear the input field
  }
});
