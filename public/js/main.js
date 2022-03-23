//access to socket.io on client side: 
const socket = io('');
const chatForm = document.getElementById('chatMessage');

//using queryString to get username and roomName from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
    });


//Add event listener to get chatMessage and emit to server 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('msg').value;  
    socket.emit('chatMessage', msg);
 })
//get message from server 
socket.on('message', (message) => {
    const {username} = Qs.parse(location.search, {
        ignoreQueryPrefix: true
        });
        console.log(username);
    if (message.username === username) {
        outputMessageReceiver(message);
    } else if (message.username === 'Zalo bot') {
        outputNotification(message);
    } else {
        outputMessageSender(message)
    }

    //everytime getting new message, chat windows will scroll to the bottom
    chatMessage.scrollTop = chatMessage.scrollHeight;
    //clear input field after sending the message
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
})


// Emit the username and room to the server
socket.emit('user-join-room', {username, room});

// listen for the roomUsers and roomName from the server, and output those to DOM by using vanilla JS
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})


//output room message:
const chatMessage = document.querySelector('.chat-box'); 

function outputMessageReceiver(message) {
    
    const li = document.createElement('li');
    li.className = 'chat-right';
    li.innerHTML=` <div class="chat-hour"> ${message.time}<span class="fa fa-check-circle"></span></div>
    <div class="chat-text">${message.text}</div>
    <div class="chat-avatar">
        <div class="chat-name">You</div>
    </div>`;

    chatMessage.appendChild(li);
}
function outputMessageSender(message) {
    
    const li = document.createElement('li');
    li.className = 'chat-left';
    li.innerHTML=`<div class="chat-avatar">
    <div class="chat-name">${message.username}</div>
    </div>
    <div class="chat-text">${message.text}</div>
    <div class="chat-hour">${message.time}<span class="fa fa-check-circle"></span></div>`

    chatMessage.appendChild(li);
}

function outputNotification(message) {
    const li = document.createElement('li');
    li.className = 'notification';
    li.innerHTML=` <div class="chat-avatar">
    <div class="chat-text">${message.text}</div>
</div>`

    chatMessage.appendChild(li);;
}

//output room users
const userList = document.querySelector('.users');
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.className = "person";
        li.innerHTML = `
        <p class="name-time">
            <span class="name">${user.username}</span>
        </p>`;
        userList.appendChild(li);
    })
}
//output room Name:
function outputRoomName(room) {
    document.getElementById('room-name').innerText = ` ${room}`
}