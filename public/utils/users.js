users = [];

//create userJoin, push it to users array and return user
function userJoin(id, username, room) {
    const user = {id, username, room};
    users.push(user);
    return user;
}

//get currentUser from the users array
function getCurrentUser(id) {
    //use find function to find user object in the users array
    return users.find(user => user.id === id);
}


//remove user out of the users array when user leave the chat room
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        //[0] to return just user index, not whole users array
        return users.splice(index, 1)[0];
    } 
}

//get all users who are currently in the room chat

function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {userJoin, getCurrentUser, userLeave, getRoomUsers};