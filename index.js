const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (username, msg, time) => {
        io.emit('chat message', username, msg, time);
    });
    socket.on('sustur', (susturulacak) => {
        io.emit('sustur', susturulacak);
    });
    socket.on('gir', (username) => {
        io.emit('gir', username);
    });
    socket.on('ebe', () => {
        io.emit('ebe');
    });
    socket.on('sil', (n) => {
        io.emit('sil', n);
    });
    socket.on('clear', () => {
        io.emit('clear');
    });
    socket.on('fuck', () => {
        io.emit('fuck');
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});