const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 핵심: 리액트가 빌드된 'build' 폴더를 서버가 읽어서 화면을 띄워줌
app.use(express.static(path.join(__dirname, 'build')));

let users = {}; // 회원 데이터 (임시)

io.on('connection', (socket) => {
    // 회원가입 로직
    socket.on('register', ({ id, pw, nickname }) => {
        if (users[id]) return socket.emit('registerResult', { success: false, msg: "중복 아이디" });
        users[id] = { pw, nickname, point: 1000 };
        socket.emit('registerResult', { success: true });
    });

    // 로그인 및 채팅 로직 (생략 - 이전과 동일)
    socket.on('login', ({ id, pw }) => {
        if (users[id] && users[id].pw === pw) {
            socket.emit('loginResult', { success: true, user: users[id] });
        }
    });
});

// 모든 경로에서 index.html을 보여줌 (리액트 라우팅 지원)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`통합 서버 가동 중: ${PORT}`));
