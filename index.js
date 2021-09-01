const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { isPrimitive } = require('util');
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let users = [];
let guests = 0;

io.on('connection', (socket) => {
    let userIn = false;
    let guestIn = false;

    socket.on('mesaj', data => {
        io.emit('mesaj', data);
    });
    socket.on('sustur', (susturulacak) => {
        io.emit('sustur', susturulacak);
    });
    socket.on('gir', data => {
        if (userIn)
            return;
        
        if (data.misafir) {
            ++guests;
            guestIn = true;

            io.emit('gir', {
                misafir: true,
                guests: guests,
                users: users
            });
        }else {
            socket.username = data.username;
            users.push(data.username);
            userIn = true;

            io.emit('gir', {
                username: data.username,
                users: users,
                misafir: false,
                guests: guests
            });
        }
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
    socket.on('disconnect', () => {
        if (userIn) {
            const index = users.indexOf(socket.username);
            if (index > -1)
                users.splice(index, 1);

            io.emit('çık', {
                username: socket.username,
                users: users,
                misafir: false,
                guests: guests
            });
        }else if (guestIn) {
            --guests;
            io.emit('çık', {
                misafir: true,
                guests: guests,
                users: users
            });
        }
    });
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });
    socket.on('not typing', (username) => {
        socket.broadcast.emit('not typing', username);
    });
    socket.on('fısılda', data => {
        io.emit('fısılda', data);
    });
    socket.on('bilgi', msg => {
        io.emit('bilgi', msg);
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('listening on *:3000');
});