var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var nameUsed = [];
var currentRoom = {};


export.listen = function(server){
	io = socketio.listen(server);
	io.set('log levle', 1);
	io.sockets.on('connection', function(socket){
		guestNumber = assignGuestName(socket, guestNumber, nickNames, nameUsed);
		joinRoom(socket, 'Lobby');
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, nameUsed);
		handleRoomJoining(socket);
	});
	socket.on('rooms', function(){
		socket.emit('rooms', io.sockets.manager.rooms);
	});
	handlerClientDisconnect(socket, nickNames, nameUsed);
}


function assignGuestName(socket, guestNumber, nickNames, nameUsed){
	var name = 'Guest' + guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameResult', {
		success: true,
		name: name
	});
	nameUsed.push(name);
	return guestNumber + 1;
}