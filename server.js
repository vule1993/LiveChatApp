const path = require('path');
const express = require('express');
const app = express(); 
const http = require('http');
const { env } = require('process');
const server = http.createServer(app); 
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./public/utils/users')
const formatMessage = require('./public/utils/message')
const botChat = 'Zalo bot'

//access to socket.io
const socketio = require('socket.io');
const io = socketio(server);

//connection to server 3000 
const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
})

app.use(cors({
    origin: "*"
}))

//emit the welcome message to client-side when there is a connection to server
io.on('connection', socket => {
    //Welcome user to the chatroom
    socket.emit('message', formatMessage(botChat, 'Welcome to Zalo Messenger !'))

    socket.on('user-join-room', ({username, room}) => {
    const user = userJoin(socket.id, username, room);
    //join the user to the room
        socket.join(user.room);
    //broadcast new user to the chatroom 
        socket.broadcast.to(user.room).emit('message', formatMessage(botChat, `${user.username} has joined the chatroom.`))   
    //emit all the user from the room info to client side by using function getRoomUsers. 
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
    })

    //listen for chatMessage from the client
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        //emit the message back other user
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })     

    //notify when user left the room 
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
        io.to(user.room).emit('message', formatMessage(botChat, `${user.username} has left the chatroom.`))
        }
        //emit all the user from the room info to client side by using function getRoomUsers - I have tthis code here one more time, it will update the user when someone disconnect. 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
})

//Set static folder. When you call app.use(),  to use middleware
//express.static() finds and returns the static files requested.
//I use path to join all the arguments together and normalize the resulting path.
//another method is app.get('/', (req, res) => {res.sendFile(__dirname + '/public/index.html');});
app.use(express.static(path.join(__dirname, 'public')));
