// components/Planet.jsx
import React from 'react';
import { motion } from 'framer-motion';

// 사용자를 나타내는 행성/별 컴포넌트
const Planet = ({ user, onClick, isLocalUser }) => {
  const size = user.size || 20; // 행성의 크기 (기본값 20px)
  const color = user.color || '#F0F0F0'; // 행성의 색상 (기본값 흰색)

  return (
    <motion.div
      className={`
        absolute cursor-pointer rounded-full flex items-center justify-center
        border-2 transition-all duration-300 ease-in-out
        ${isLocalUser ? 'border-sky-400' : 'border-gray-500'}
      `}
      initial={{ opacity: 0, scale: 0 }} // 초기 애니메이션 상태 (투명하고 작게 시작)
      animate={{ opacity: 1, scale: 1 }} // 등장 애니메이션 (불투명하고 원래 크기로)
      exit={{ opacity: 0, scale: 0 }} // 사라지는 애니메이션 (투명하고 작아지면서 사라짐)
      transition={{ type: "spring", stiffness: 200, damping: 10 }} // 스프링 애니메이션 효과
      style={{
        left: user.x, // 행성의 X 좌표
        top: user.y, // 행성의 Y 좌표
        width: size, // 행성의 너비
        height: size, // 행성의 높이
        backgroundColor: color, // 행성 내부 색상
        // 호버 시 빛나는 효과 (그림자)
        boxShadow: `0 0 ${size / 3}px ${size / 6}px ${color}, 0 0 ${size}px ${size / 20}px rgba(255,255,255,0.2)`
      }}
      whileHover={{
        scale: 1.2, // 호버 시 1.2배 확대
        boxShadow: `0 0 ${size / 2}px ${size / 4}px ${color}, 0 0 ${size * 1.5}px ${size / 10}px rgba(255,255,255,0.4)` // 호버 시 그림자 강도 증가
      }}
      onClick={() => onClick(user)} // 클릭 시 전달된 onClick 함수 호출
    >
      {/* 로컬 사용자일 경우 'ME' 텍스트 표시 */}
      <span className="text-xs text-black font-semibold pointer-events-none">
        {isLocalUser ? 'ME' : ''}
      </span>
    </motion.div>
  );
};

export default Planet;
