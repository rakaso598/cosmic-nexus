// //=================================================================
// //==============웹소켓 서버 사용시 실시간 동작하는 코드를 보존==============
// //=================================================================

// 'use client'; // 클라이언트 컴포넌트임을 명시 (Next.js 13+에서 필요)

// import { useState, useEffect, useRef } from 'react';
// import { generateUUID } from '../lib/utils'; // 유틸리티 함수 임포트
// import io from 'socket.io-client'; // Socket.IO 클라이언트 라이브러리 임포트

// // 웹소켓 연결 및 데이터 처리를 담당하는 커스텀 훅
// const useWebSocket = () => {
//   const [localUser, setLocalUser] = useState(null); // 현재 로컬 사용자 상태
//   const [remoteUsers, setRemoteUsers] = useState({}); // 원격 사용자들을 저장할 객체 { id: userObject }
//   const socketRef = useRef(null); // 실제 웹소켓 인스턴스를 저장할 ref

//   useEffect(() => {
//     // 1. 로컬 사용자 ID 생성 및 초기화
//     let currentUserId = localStorage.getItem('anonymousId');
//     if (!currentUserId) {
//       currentUserId = `Voyager-${generateUUID().substring(0, 8)}`;
//       localStorage.setItem('anonymousId', currentUserId);
//     }
//     console.log(`로컬 사용자 ID: ${currentUserId}`);

//     const newLocalUser = {
//       id: currentUserId,
//       // 로컬 행성의 초기 위치를 화면 내의 랜덤 위치로 설정
//       x: Math.random() * (window.innerWidth - 40) + 20, // 화면 너비 내에서 20px 패딩을 두고 랜덤 X 위치
//       y: Math.random() * (window.innerHeight - 40) + 20, // 화면 높이 내에서 20px 패딩을 두고 랜덤 Y 위치
//       size: 25,
//       color: `hsl(${Math.random() * 360}, 70%, 60%)`,
//       connectedAt: Date.now(),
//       isLocalUser: true, // 이 플래그는 클라이언트 내부에서만 사용됩니다.
//     };
//     setLocalUser(newLocalUser);

//     // 2. 실제 WebSocket 연결
//     const socket = io('http://localhost:3001');
//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('[클라이언트] WebSocket 서버에 연결되었습니다.');
//       // 서버에 보낼 사용자 데이터에서 isLocalUser 플래그는 제거합니다.
//       // 이 플래그는 클라이언트 자체에서만 의미가 있습니다.
//       const userDataToSend = { ...newLocalUser };
//       delete userDataToSend.isLocalUser; // 서버에는 이 정보가 필요 없습니다.
//       socket.emit('user_connected', userDataToSend);
//     });

//     socket.on('user_connected', (user) => {
//       // 서버로부터 받은 사용자 정보는 isLocalUser 플래그를 포함하지 않습니다.
//       if (user.id !== currentUserId) {
//         console.log(`[클라이언트] 새로운 사용자 접속: ${user.id}`);
//         setRemoteUsers(prev => ({ ...prev, [user.id]: user }));
//       }
//     });

//     socket.on('current_users', (users) => {
//       const usersMap = {};
//       users.forEach(user => {
//         usersMap[user.id] = user;
//       });
//       setRemoteUsers(usersMap);
//       console.log(`[클라이언트] 현재 접속 중인 사용자들 로드: ${users.length}명`);
//     });

//     socket.on('user_moved', (user) => {
//       if (user.id !== currentUserId) {
//         setRemoteUsers(prev => ({ ...prev, [user.id]: user }));
//       } else {
//         // 자신의 행성 위치가 서버를 통해 다시 전달된 경우 (선택 사항: 지연 보정 등)
//         // 현재는 마우스 팔로우가 없으므로 이 블록은 로컬 업데이트에만 영향을 줍니다.
//         setLocalUser(prev => ({ ...prev, x: user.x, y: user.y }));
//       }
//     });

//     socket.on('user_disconnected', (userId) => {
//       console.log(`[클라이언트] 사용자 접속 해제: ${userId}`);
//       setRemoteUsers(prev => {
//         const newUsers = { ...prev };
//         delete newUsers[userId];
//         return newUsers;
//       });
//     });

//     socket.on('disconnect', () => {
//       console.log('[클라이언트] WebSocket 서버 연결이 해제되었습니다.');
//     });

//     // 클린업 함수
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//       }
//       localStorage.removeItem('anonymousId');
//     };
//   }, []); // 컴포넌트 마운트 시 한 번만 실행

//   return { localUser, remoteUsers: Object.values(remoteUsers) };
// };

// export default useWebSocket;