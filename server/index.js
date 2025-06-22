// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Socket.IO Server 임포트

const app = express();
const server = http.createServer(app); // Express 앱을 기반으로 HTTP 서버 생성

// Socket.IO 서버를 HTTP 서버에 연결하고 CORS 설정
// 클라이언트(Next.js 앱)가 다른 도메인(여기서는 localhost:3000)에서 접속할 수 있도록 허용합니다.
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Next.js 앱이 실행될 주소
    methods: ["GET", "POST"] // 허용할 HTTP 메서드
  }
});

// 접속한 모든 사용자들의 정보를 저장할 객체
// { "socketId1": { id: "user1", x: 100, y: 200, ... }, "socketId2": { ... } }
const connectedUsers = {};

// Socket.IO 연결 이벤트 리스너
// 클라이언트가 서버에 연결될 때마다 이 콜백 함수가 실행됩니다.
io.on('connection', (socket) => {
  console.log(`[서버] 새로운 사용자 연결됨: ${socket.id}`);

  // 1. 클라이언트로부터 'user_connected' 이벤트를 받으면 실행
  // 클라이언트가 자신의 익명 ID와 초기 위치 등을 서버에 보냅니다.
  socket.on('user_connected', (userData) => {
    // 이미 연결된 사용자의 소켓 ID에 해당 사용자 정보를 매핑하여 저장
    connectedUsers[socket.id] = {
      ...userData,
      socketId: socket.id // 소켓 ID 추가 (필요시)
    };
    console.log(`[서버] 사용자 정보 수신: ${userData.id}`);

    // 현재 접속한 모든 사용자들에게 새로운 사용자의 정보를 브로드캐스트
    // socket.broadcast.emit은 자신을 제외한 모든 클라이언트에게 보냅니다.
    socket.broadcast.emit('user_connected', connectedUsers[socket.id]);

    // 새로운 사용자에게 현재 서버에 접속해 있는 모든 기존 사용자 정보를 전송
    // (자신을 제외한) 모든 사용자를 배열로 만들어 새 접속자에게 보냅니다.
    const otherUsers = Object.values(connectedUsers).filter(user => user.socketId !== socket.id);
    socket.emit('current_users', otherUsers);
    console.log(`[서버] 현재 ${Object.keys(connectedUsers).length}명 접속 중.`);
  });

  // 2. 클라이언트로부터 'user_move' 이벤트를 받으면 실행
  // 사용자가 자신의 행성 위치를 변경할 때마다 서버에 위치를 보냅니다.
  socket.on('user_move', (userData) => {
    if (connectedUsers[socket.id]) {
      // 해당 사용자의 위치 정보 업데이트
      connectedUsers[socket.id].x = userData.x;
      connectedUsers[socket.id].y = userData.y;

      // 업데이트된 사용자 위치를 자신을 제외한 모든 클라이언트에게 브로드캐스트
      socket.broadcast.emit('user_moved', connectedUsers[socket.id]);
    }
  });

  // 3. 클라이언트 연결 해제 이벤트 리스너
  // 클라이언트가 연결을 끊으면 이 콜백 함수가 실행됩니다.
  socket.on('disconnect', () => {
    if (connectedUsers[socket.id]) {
      const disconnectedUserId = connectedUsers[socket.id].id;
      delete connectedUsers[socket.id]; // 접속 사용자 목록에서 제거
      console.log(`[서버] 사용자 연결 해제됨: ${socket.id} (${disconnectedUserId})`);

      // 자신을 제외한 모든 클라이언트에게 해당 사용자가 접속 해제되었음을 알림
      io.emit('user_disconnected', disconnectedUserId); // io.emit은 모든 클라이언트에게 보냅니다.
    }
  });
});

// 서버가 특정 포트에서 요청을 수신하도록 설정
const PORT = process.env.PORT || 3001; // Next.js 앱이 3000번 포트를 사용하므로 3001번 포트 사용
server.listen(PORT, () => {
  console.log(`[서버] WebSocket 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
