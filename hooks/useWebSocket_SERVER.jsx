// //=================================================================
// //===============웹소켓 서버 사용시 실시간 동작하는 코드 보존===============
// //=================================================================

// // hooks/useWebSocket.jsx
// 'use client'; // 클라이언트 컴포넌트임을 명시 (Next.js 13+에서 필요)

// import { useState, useEffect, useRef } from 'react';
// import { generateUUID } from '../lib/utils'; // 유틸리티 함수 임포트
// import io from 'socket.io-client'; // Socket.IO 클라이언트 라이브러리 임포트

// // 웹소켓 연결 및 데이터 처리를 담당하는 커스텀 훅
// const useWebSocket = () => {
//   const [localUser, setLocalUser] = useState(null); // 현재 로컬 사용자 상태
//   const [remoteUsers, setRemoteUsers] = useState({}); // 원격 사용자들을 저장할 객체 { id: userObject }
//   const socketRef = useRef(null); // 실제 웹소켓 인스턴스를 저장할 ref
//   const growthIntervalRef = useRef(null); // 행성 크기 성장을 위한 인터벌 ID 저장

//   // 행성 크기 관련 상수 정의
//   const INITIAL_SIMULATED_MIN_SIZE = 15; // (시뮬레이션에서 사용했으나, 참고용으로 남겨둠)
//   const INITIAL_SIMULATED_MAX_SIZE = 30; // (시뮬레이션에서 사용했으나, 참고용으로 남겨둠)
//   const MAX_PLANET_SIZE = 80; // 행성이 최대로 커질 수 있는 크기
//   const GROWTH_RATE_PER_SECOND = 0.8; // 초당 행성이 커지는 비율 (픽셀/초)
//   const GROWTH_INTERVAL_MS = 2000; // 크기 성장 로직 실행 간격 (2초마다)

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
//       x: Math.random() * (window.innerWidth - 40) + 20, // 화면 내 랜덤 X 위치
//       y: Math.random() * (window.innerHeight - 40) + 20, // 화면 내 랜덤 Y 위치
//       size: 25, // 로컬 행성의 초기 크기
//       color: `hsl(${Math.random() * 360}, 70%, 60%)`, // 랜덤 색상
//       connectedAt: Date.now(), // 접속 시간 기록 (행성 성장에 사용)
//       isLocalUser: true, // 이 플래그는 클라이언트 내부에서만 사용됩니다.
//     };
//     setLocalUser(newLocalUser);

//     // 2. 실제 WebSocket 연결
//     const WEBSOCKET_SERVER_URL = "http://localhost:3001"; // TODO: 실제 배포 시 이 URL을 변경하세요!
//     const socket = io(WEBSOCKET_SERVER_URL);
//     socketRef.current = socket;

//     socket.on('connect', () => {
//       console.log('[클라이언트] WebSocket 서버에 연결되었습니다.');
//       // 서버에 보낼 사용자 데이터에서 isLocalUser 플래그는 제거합니다.
//       const userDataToSend = { ...newLocalUser };
//       delete userDataToSend.isLocalUser; // 서버에는 이 정보가 필요 없습니다.
//       socket.emit('user_connected', userDataToSend);
//     });

//     socket.on('user_connected', (user) => {
//       // 서버로부터 받은 사용자 정보에는 isLocalUser 플래그가 없으므로 그대로 사용
//       if (user.id !== currentUserId) {
//         console.log(`[클라이언트] 새로운 사용자 접속: ${user.id}`);
//         // 새로운 사용자의 connectedAt을 기록 (성장에 사용)
//         setRemoteUsers(prev => ({ ...prev, [user.id]: { ...user, connectedAt: Date.now() } }));
//       }
//     });

//     socket.on('current_users', (users) => {
//       const usersMap = {};
//       users.forEach(user => {
//         // 기존 사용자들의 connectedAt을 현재 시간으로 기록 (새로 접속한 클라이언트 기준)
//         usersMap[user.id] = { ...user, connectedAt: Date.now() };
//       });
//       setRemoteUsers(usersMap);
//       console.log(`[클라이언트] 현재 접속 중인 사용자들 로드: ${users.length}명`);
//     });

//     socket.on('user_moved', (user) => {
//       // 서버로부터 다른 사용자들의 위치 업데이트 정보를 받으면 처리
//       if (user.id !== currentUserId) {
//         setRemoteUsers(prev => {
//           // 기존 connectedAt을 유지하면서 위치만 업데이트
//           return { ...prev, [user.id]: { ...prev[user.id], x: user.x, y: user.y } };
//         });
//       }
//       // 로컬 사용자의 위치 업데이트는 마우스 팔로우 로직 제거로 인해 이제 이 경로를 타지 않습니다.
//       // 따라서, setLocalUser를 통한 로컬 위치 업데이트는 여기서는 필요 없습니다.
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

//     // 3. 행성 크기 성장 로직 (웹소켓 연결과 별개로 주기적으로 실행)
//     growthIntervalRef.current = setInterval(() => {
//       // 로컬 사용자 행성 크기 성장
//       setLocalUser(prevLocalUser => {
//         if (!prevLocalUser) return null;

//         const elapsedTimeInSeconds = (Date.now() - prevLocalUser.connectedAt) / 1000;
//         let newLocalSize = prevLocalUser.size + (GROWTH_RATE_PER_SECOND * (GROWTH_INTERVAL_MS / 1000));
//         newLocalSize = Math.min(newLocalSize, MAX_PLANET_SIZE);

//         if (newLocalSize !== prevLocalUser.size) {
//           return { ...prevLocalUser, size: newLocalSize };
//         }
//         return prevLocalUser;
//       });

//       // 원격 사용자 행성 크기 성장
//       setRemoteUsers(prevRemoteUsers => {
//         const updatedUsers = { ...prevRemoteUsers };
//         let changed = false;

//         Object.values(updatedUsers).forEach(user => {
//           const elapsedTimeInSeconds = (Date.now() - user.connectedAt) / 1000;
//           let newSize = user.size + (GROWTH_RATE_PER_SECOND * (GROWTH_INTERVAL_MS / 1000));
//           newSize = Math.min(newSize, MAX_PLANET_SIZE);

//           if (newSize !== user.size) {
//             updatedUsers[user.id] = { ...user, size: newSize };
//             changed = true;
//           }
//         });

//         // 변경된 사항이 있을 때만 새로운 객체 반환하여 리렌더링 트리거
//         return changed ? updatedUsers : prevRemoteUsers;
//       });

//     }, GROWTH_INTERVAL_MS); // 2초마다 실행

//     // 클린업 함수 (컴포넌트 언마운트 시 실행)
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect(); // 실제 웹소켓 연결 해제
//       }
//       if (growthIntervalRef.current) {
//         clearInterval(growthIntervalRef.current); // 성장 인터벌 해제
//       }
//       localStorage.removeItem('anonymousId'); // 세션 종료 시 익명 ID 삭제 (선택 사항)
//     };
//   }, []); // 이펙트는 컴포넌트 마운트 시 한 번만 실행됩니다.

//   return { localUser, remoteUsers: Object.values(remoteUsers) };
// };

// export default useWebSocket;
