// components/PlanetInfoOverlay.jsx
import React from 'react';
import { motion } from 'framer-motion';

// 행성 클릭 시 정보를 표시하는 오버레이 컴포넌트
const PlanetInfoOverlay = ({ user, onClose }) => {
  if (!user) return null; // user 객체가 없으면 아무것도 렌더링하지 않음

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }} // 초기 투명 상태
      animate={{ opacity: 1 }} // 등장 시 불투명하게
      exit={{ opacity: 0 }} // 사라질 때 투명하게
    >
      <motion.div
        className="bg-gray-900 border border-gray-700 rounded-lg p-8 shadow-2xl relative max-w-md w-full text-center"
        initial={{ y: -50, opacity: 0 }} // 초기 Y 위치와 투명도
        animate={{ y: 0, opacity: 1 }} // 등장 시 중앙으로 이동하며 불투명하게
        exit={{ y: 50, opacity: 0 }} // 사라질 때 아래로 이동하며 투명하게
        transition={{ type: "spring", stiffness: 150, damping: 15 }} // 스프링 애니메이션
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors duration-200"
        >
          <i className="fas fa-times"></i> {/* Font Awesome X 아이콘 */}
        </button>
        {/* 사용자 ID */}
        <h2 className="text-4xl font-bold text-sky-400 mb-4">{user.id}</h2>
        {/* 사용자 메시지 */}
        <p className="text-gray-300 text-lg mb-6">
          {user.isLocalUser ? "당신은 이 우주를 탐험하는 여행자입니다." : "알 수 없는 행성에서 온 방문자입니다."}
        </p>
        {/* 접속 시간 */}
        <p className="text-gray-500 text-sm">
          접속 시간: {new Date(user.connectedAt).toLocaleTimeString()}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PlanetInfoOverlay;
