// hooks/useWebSocket.jsx
import { useState, useEffect, useRef } from 'react';
import { generateUUID } from '../lib/utils'; // 유틸리티 함수 임포트

// 웹소켓 연결 및 데이터 처리를 담당하는 커스텀 훅 (시뮬레이션 버전)
const useWebSocket = () => {
  const [localUser, setLocalUser] = useState(null); // 현재 로컬 사용자 상태
  const [remoteUsers, setRemoteUsers] = useState({}); // 원격 사용자들을 저장할 객체 { id: userObject }
  const socketRef = useRef(null); // 실제 웹소켓 인스턴스를 저장할 ref (현재 사용 안 함)
  const intervalRef = useRef(null); // 시뮬레이션 인터벌 ID 저장

  useEffect(() => {
    // 1. 로컬 사용자 ID 생성 및 초기화
    let currentUserId = localStorage.getItem('anonymousId');
    if (!currentUserId) {
      // localStorage에 ID가 없으면 새로 생성
      currentUserId = `Voyager-${generateUUID().substring(0, 8)}`;
      localStorage.setItem('anonymousId', currentUserId); // 생성된 ID 저장
    }
    console.log(`로컬 사용자 ID: ${currentUserId}`);

    // 로컬 사용자 객체 생성
    const newLocalUser = {
      id: currentUserId,
      x: Math.random() * (window.innerWidth - 40) + 20, // 캔버스 내 랜덤 X 위치
      y: Math.random() * (window.innerHeight - 40) + 20, // 캔버스 내 랜덤 Y 위치
      size: 25, // 로컬 사용자 행성 크기
      color: `hsl(${Math.random() * 360}, 70%, 60%)`, // 랜덤 색상
      connectedAt: Date.now(), // 접속 시간
      isLocalUser: true, // 로컬 사용자인지 여부 플래그
    };
    setLocalUser(newLocalUser); // 로컬 사용자 상태 업데이트

    // 2. WebSocket 연결 시뮬레이션 (실제로는 아래 주석 처리된 Socket.IO 연결 로직 사용)
    /*
    // 실제 Socket.IO 서버 주소로 연결
    const socket = io('http://localhost:3001'); // 여기에 실제 서버 주소를 넣으세요
    socketRef.current = socket; // 실제 소켓 인스턴스 저장

    // 실제 Socket.IO 이벤트 리스너 (예시)
    socket.on('connect', () => {
      console.log('WebSocket connected');
      socket.emit('user_connected', newLocalUser); // 서버에 로컬 사용자 정보 전송
    });

    socket.on('user_connected', (user) => {
      if (user.id !== currentUserId) { // 자신이 아닌 다른 사용자 접속 시
        console.log(`사용자 접속: ${user.id}`);
        setRemoteUsers(prev => ({ ...prev, [user.id]: user })); // 원격 사용자 목록에 추가
      }
    });

    socket.on('user_disconnected', (userId) => {
      console.log(`사용자 접속 해제: ${userId}`);
      setRemoteUsers(prev => {
        const newUsers = { ...prev };
        delete newUsers[userId]; // 원격 사용자 목록에서 삭제
        return newUsers;
      });
    });

    socket.on('user_moved', (user) => {
      if (user.id !== currentUserId) { // 자신이 아닌 다른 사용자 이동 시
        setRemoteUsers(prev => ({ ...prev, [user.id]: user })); // 원격 사용자 위치 업데이트
      }
    });
    */

    // 시뮬레이션 로직: 다른 사용자 접속/이동/해제를 모의 (위의 실제 WebSocket 코드를 대체)
    let simulatedUsers = {}; // 시뮬레이션용 원격 사용자 객체
    let nextSimulatedId = 1; // 시뮬레이션 ID 카운터

    intervalRef.current = setInterval(() => {
      // 새로운 사용자 접속 시뮬레이션 (최대 5명, 20% 확률)
      if (Object.keys(simulatedUsers).length < 5 && Math.random() < 0.2) {
        const newUser = {
          id: `Starlight-${nextSimulatedId++}`,
          x: Math.random() * (window.innerWidth - 40) + 20,
          y: Math.random() * (window.innerHeight - 40) + 20,
          size: Math.random() * 15 + 15, // 15px에서 30px 사이의 크기
          color: `hsl(${Math.random() * 360}, 70%, 60%)`, // 랜덤 색상
          connectedAt: Date.now(),
          isLocalUser: false,
        };
        simulatedUsers[newUser.id] = newUser;
        setRemoteUsers(prev => ({ ...prev, [newUser.id]: newUser }));
        console.log(`[시뮬레이션] 새 사용자 접속: ${newUser.id}`);
      }

      // 기존 사용자 이동 시뮬레이션
      Object.values(simulatedUsers).forEach(user => {
        user.x += (Math.random() - 0.5) * 5; // X 좌표를 -2.5에서 2.5 사이로 이동
        user.y += (Math.random() - 0.5) * 5; // Y 좌표를 -2.5에서 2.5 사이로 이동
        // 화면 밖으로 나가지 않도록 좌표 조정
        user.x = Math.max(20, Math.min(window.innerWidth - 40, user.x));
        user.y = Math.max(20, Math.min(window.innerHeight - 40, user.y));
        setRemoteUsers(prev => ({ ...prev, [user.id]: { ...user } })); // 강제 업데이트를 위해 새 객체 생성
      });

      // 사용자 접속 해제 시뮬레이션 (5% 확률)
      if (Object.keys(simulatedUsers).length > 0 && Math.random() < 0.05) {
        const ids = Object.keys(simulatedUsers);
        const randomId = ids[Math.floor(Math.random() * ids.length)]; // 랜덤 사용자 선택
        delete simulatedUsers[randomId]; // 시뮬레이션 목록에서 삭제
        setRemoteUsers(prev => {
          const newUsers = { ...prev };
          delete newUsers[randomId]; // 원격 사용자 목록에서 삭제
          return newUsers;
        });
        console.log(`[시뮬레이션] 사용자 접속 해제: ${randomId}`);
      }

    }, 2000); // 2초마다 시뮬레이션 업데이트

    // 클린업 함수 (컴포넌트 언마운트 시 실행)
    return () => {
      /*
      if (socketRef.current) {
        socketRef.current.disconnect(); // 실제 웹소켓 연결 해제
      }
      */
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // 시뮬레이션 인터벌 해제
      }
      localStorage.removeItem('anonymousId'); // 세션 종료 시 익명 ID 삭제 (선택 사항)
    };
  }, []); // 이펙트는 컴포넌트 마운트 시 한 번만 실행됩니다.

  // (선택 사항) 로컬 사용자 위치를 마우스 움직임에 따라 업데이트하고 서버에 전송하는 함수
  // 현재는 사용되지 않지만, 사용자가 자신의 행성을 직접 움직이도록 할 때 활용할 수 있습니다.
  // const handleMouseMove = useCallback((event) => {
  //   if (localUser && socketRef.current) {
  //     const newX = event.clientX - localUser.size / 2;
  //     const newY = event.clientY - localUser.size / 2;
  //     const updatedLocalUser = { ...localUser, x: newX, y: newY };
  //     setLocalUser(updatedLocalUser);
  //     socketRef.current.emit('user_move', updatedLocalUser); // 서버에 위치 전송
  //   }
  // }, [localUser]);

  // useEffect(() => {
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, [handleMouseMove]);

  return { localUser, remoteUsers: Object.values(remoteUsers) }; // 로컬 및 원격 사용자 데이터 반환
};

export default useWebSocket;
