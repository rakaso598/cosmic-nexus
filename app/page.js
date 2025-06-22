// app/page.jsx
'use client'; // 이 파일이 클라이언트 컴포넌트임을 명시 (Next.js App Router에서 중요)

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion'; // 등장/퇴장 애니메이션을 위한 컴포넌트

// 개별 컴포넌트 및 훅 임포트
import SpaceBackground from '../components/SpaceBackground';
import Planet from '../components/Planet';
import PlanetInfoOverlay from '../components/PlanetInfoOverlay';
import useWebSocket from '../hooks/useWebSocket';

// 메인 페이지 컴포넌트
export default function HomePage() {
  // useWebSocket 훅을 사용하여 로컬 사용자 및 원격 사용자 데이터 가져오기
  const { localUser, remoteUsers } = useWebSocket();
  // 클릭된 행성(사용자)의 정보를 저장할 상태
  const [selectedUser, setSelectedUser] = useState(null);

  // 로컬 사용자와 원격 사용자들을 모두 포함하는 배열 생성
  const allUsers = localUser ? [localUser, ...remoteUsers] : [...remoteUsers];

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center">
      {/* 우주 배경 컴포넌트 렌더링 */}
      <SpaceBackground />

      {/* 사용자 행성들을 렌더링할 영역 */}
      <div className="absolute inset-0 z-10">
        <AnimatePresence> {/* 행성 등장/퇴장 애니메이션을 관리 */}
          {allUsers.map((user) => (
            <Planet
              key={user.id} // 각 행성의 고유 키 (React 리스트 렌더링에 필수)
              user={user} // 행성 데이터 전달
              onClick={setSelectedUser} // 클릭 시 selectedUser 상태 업데이트 함수 전달
              isLocalUser={user.isLocalUser} // 로컬 사용자인지 여부 전달
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 정보 오버레이 렌더링 (selectedUser가 있을 때만) */}
      <AnimatePresence>
        {selectedUser && (
          <PlanetInfoOverlay
            user={selectedUser} // 선택된 사용자 정보 전달
            onClose={() => setSelectedUser(null)} // 오버레이 닫기 함수 전달
          />
        )}
      </AnimatePresence>

      {/* 중앙 하단 정보 패널 */}
      <div className="absolute bottom-8 z-20 bg-gray-900 bg-opacity-70 border border-gray-700 rounded-xl p-4 text-center shadow-lg backdrop-blur-md">
        <p className="text-xl text-sky-300 font-semibold mb-2">Cosmic Nexus</p>
        <p className="text-gray-400 text-sm">우주를 떠다니는 익명 방문자들과 교류하세요.</p>
        {localUser && (
          <p className="text-gray-500 text-xs mt-2">당신의 ID: {localUser.id}</p>
        )}
      </div>
    </div>
  );
}
