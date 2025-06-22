// hooks/useWebSocket.jsx
'use client'; // 클라이언트 컴포넌트임을 명시 (Next.js 13+에서 필요)

import { useState, useEffect, useRef } from 'react'; // 오류 수정: `}>` 제거
import { generateUUID } from '../lib/utils'; // 유틸리티 함수 임포트
// import io from 'socket.io-client'; // 실제 웹소켓 클라이언트 라이브러리는 임포트하지 않음

// 웹소켓 연결 및 데이터 처리를 담당하는 커스텀 훅 (시뮬레이션 모드)
const useWebSocket = () => {
  const [localUser, setLocalUser] = useState(null); // 현재 로컬 사용자 상태
  const [remoteUsers, setRemoteUsers] = useState({}); // 원격 사용자들을 저장할 객체 { id: userObject }
  // const socketRef = useRef(null); // 실제 웹소켓 인스턴스는 사용하지 않음
  const intervalRef = useRef(null); // 시뮬레이션 인터벌 ID 저장

  // 행성 크기 관련 상수 정의
  const INITIAL_SIMULATED_MIN_SIZE = 15; // 시뮬레이션 행성의 최소 초기 크기
  const INITIAL_SIMULATED_MAX_SIZE = 30; // 시뮬레이션 행성의 최대 초기 크기
  const MAX_PLANET_SIZE = 80; // 행성이 최대로 커질 수 있는 크기
  const GROWTH_RATE_PER_SECOND = 0.8; // 초당 행성이 커지는 비율 (픽셀/초)
  // const MOVEMENT_INTENSITY = 5; // 행성 이동 강도 (픽셀) - 이제 사용하지 않으므로 주석 처리 또는 삭제

  useEffect(() => {
    // 1. 로컬 사용자 ID 생성 및 초기화
    let currentUserId = localStorage.getItem('anonymousId');
    if (!currentUserId) {
      currentUserId = `Voyager-${generateUUID().substring(0, 8)}`;
      localStorage.setItem('anonymousId', currentUserId);
    }
    console.log(`로컬 사용자 ID: ${currentUserId}`);

    const newLocalUser = {
      id: currentUserId,
      x: Math.random() * (window.innerWidth - 40) + 20, // 화면 너비 내에서 20px 패딩을 두고 랜덤 X 위치
      y: Math.random() * (window.innerHeight - 40) + 20, // 화면 높이 내에서 20px 패딩을 두고 랜덤 Y 위치
      size: 25, // 로컬 행성의 초기 크기는 고정
      color: `hsl(${Math.random() * 360}, 70%, 60%)`, // 랜덤 색상
      connectedAt: Date.now(), // 접속 시간 기록
      isLocalUser: true, // 이 플래그는 클라이언트 내부에서만 사용됩니다.
    };
    setLocalUser(newLocalUser);

    // 2. 웹소켓 연결 대신 시뮬레이션 로직 활성화
    // 실제 WebSocket 연결 코드는 주석 처리합니다.
    /*
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[클라이언트] WebSocket 서버에 연결되었습니다.');
      const userDataToSend = { ...newLocalUser };
      delete userDataToSend.isLocalUser;
      socket.emit('user_connected', userDataToSend);
    });

    socket.on('user_connected', (user) => {
      if (user.id !== currentUserId) {
        console.log(`[클라이언트] 새로운 사용자 접속: ${user.id}`);
        setRemoteUsers(prev => ({ ...prev, [user.id]: user }));
      }
    });

    socket.on('current_users', (users) => {
      const usersMap = {};
      users.forEach(user => {
        usersMap[user.id] = user;
      });
      setRemoteUsers(usersMap);
      console.log(`[클라이언트] 현재 접속 중인 사용자들 로드: ${users.length}명`);
    });

    socket.on('user_moved', (user) => {
      if (user.id !== currentUserId) {
        setRemoteUsers(prev => ({ ...prev, [user.id]: user }));
      } else {
        setLocalUser(prev => ({ ...prev, x: user.x, y: user.y }));
      }
    });

    socket.on('user_disconnected', (userId) => {
      console.log(`[클라이언트] 사용자 접속 해제: ${userId}`);
      setRemoteUsers(prev => {
        const newUsers = { ...prev };
        delete newUsers[userId];
        return newUsers;
      });
    });

    socket.on('disconnect', () => {
      console.log('[클라이언트] WebSocket 서버 연결이 해제되었습니다.');
    });
    */

    // 시뮬레이션 로직: 다른 사용자 접속/이동/해제를 모의
    let simulatedUsers = {}; // 시뮬레이션용 원격 사용자 객체
    let nextSimulatedId = 1; // 시뮬레이션 ID 카운터

    intervalRef.current = setInterval(() => {
      // 새로운 사용자 접속 시뮬레이션 (최대 5명, 20% 확률)
      if (Object.keys(simulatedUsers).length < 5 && Math.random() < 0.2) {
        const newUser = {
          id: `Starlight-${nextSimulatedId++}`,
          x: Math.random() * (window.innerWidth - 40) + 20,
          y: Math.random() * (window.innerHeight - 40) + 20,
          size: Math.random() * (INITIAL_SIMULATED_MAX_SIZE - INITIAL_SIMULATED_MIN_SIZE) + INITIAL_SIMULATED_MIN_SIZE, // 초기 크기 랜덤 설정
          color: `hsl(${Math.random() * 360}, 70%, 60%)`, // 랜덤 색상
          connectedAt: Date.now(), // 접속 시간 기록
        };
        simulatedUsers[newUser.id] = newUser;
        setRemoteUsers(prev => ({ ...prev, [newUser.id]: newUser }));
        console.log(`[시뮬레이션] 새 사용자 접속: ${newUser.id}`);
      }

      // 기존 사용자 크기 성장 시뮬레이션 (움직임 삭제)
      Object.values(simulatedUsers).forEach(user => {
        // 행성 이동 로직 삭제
        // user.x += (Math.random() - 0.5) * MOVEMENT_INTENSITY;
        // user.y += (Math.random() - 0.5) * MOVEMENT_INTENSITY;

        // 화면 밖으로 나가지 않도록 좌표 조정 (이동 로직이 없어도 안전을 위해 유지)
        user.x = Math.max(20, Math.min(window.innerWidth - 40, user.x));
        user.y = Math.max(20, Math.min(window.innerHeight - 40, user.y));

        // 접속 시간에 따라 행성 크기 성장
        const elapsedTimeInSeconds = (Date.now() - user.connectedAt) / 1000;
        let newSize = user.size + (GROWTH_RATE_PER_SECOND * (2 / 2)); // 2초마다 호출되므로 1초 성장을 위한 보정
        newSize = Math.min(newSize, MAX_PLANET_SIZE); // 최대 크기 제한

        user.size = newSize; // 업데이트된 크기 적용

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
        socketRef.current.disconnect(); // 실제 웹소켓 연결 해제 (주석 처리)
      }
      */
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // 시뮬레이션 인터벌 해제
      }
      localStorage.removeItem('anonymousId'); // 세션 종료 시 익명 ID 삭제 (선택 사항)
    };
  }, []); // 이펙트는 컴포넌트 마운트 시 한 번만 실행됩니다.

  return { localUser, remoteUsers: Object.values(remoteUsers) };
};

export default useWebSocket;
