// components/SpaceBackground.jsx
import React, { useEffect, useRef } from 'react';

// 우주 배경을 캔버스에 그리는 컴포넌트
const SpaceBackground = () => {
  const canvasRef = useRef(null); // 캔버스 요소에 접근하기 위한 ref
  const animationFrameId = useRef(null); // 애니메이션 프레임 ID 저장 (클린업을 위해)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // 캔버스 요소가 없으면 함수 종료

    const ctx = canvas.getContext('2d'); // 2D 렌더링 컨텍스트 가져오기
    let stars = []; // 별 객체들을 저장할 배열
    const numStars = 1000; // 별의 개수
    const starSpeed = 0.05; // 별의 기본 이동 속도

    // 캔버스 크기를 윈도우 크기에 맞게 설정하고 별들을 초기화하는 함수
    const resizeCanvas = () => {
      canvas.width = window.innerWidth; // 캔버스 너비를 윈도우 너비로 설정
      canvas.height = window.innerHeight; // 캔버스 높이를 윈도우 높이로 설정
      stars = []; // 크기 변경 시 기존 별들 삭제 및 재생성
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width, // 별의 초기 X 위치 (랜덤)
          y: Math.random() * canvas.height, // 별의 초기 Y 위치 (랜덤)
          size: Math.random() * 1.5 + 0.5, // 별의 크기 (0.5에서 2 사이)
          alpha: Math.random(), // 별의 투명도 (0에서 1 사이)
          speed: Math.random() * starSpeed + starSpeed / 2, // 별의 개별 이동 속도
        });
      }
    };

    resizeCanvas(); // 컴포넌트 마운트 시 초기 크기 설정
    window.addEventListener('resize', resizeCanvas); // 윈도우 크기 변경 시 캔버스 크기 재설정

    // 별들을 애니메이션하고 그리는 함수
    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 이전 프레임 지우기
      ctx.fillStyle = 'black'; // 배경 색상을 검은색으로 설정
      ctx.fillRect(0, 0, canvas.width, canvas.height); // 캔버스 전체를 검은색으로 채움

      stars.forEach(star => {
        // 별 이동 시뮬레이션 (아래로 흐르는 느낌)
        star.y += star.speed; // 별의 Y 위치를 속도만큼 증가
        if (star.y > canvas.height) {
          star.y = 0; // 화면 밖으로 나가면 캔버스 맨 위로 다시 배치
          star.x = Math.random() * canvas.width; // 새로운 X 위치 (랜덤)
        }

        ctx.beginPath(); // 새로운 경로 시작
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); // 원형 별 그리기
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`; // 별의 색상과 투명도 설정
        ctx.shadowBlur = star.size * 2; // 별에 그림자 블러 효과 추가
        ctx.shadowColor = `rgba(255, 255, 255, ${star.alpha})`; // 그림자 색상 설정
        ctx.fill(); // 별 채우기

        // 알파 값 깜빡임 효과 (미세하게 투명도 변경)
        star.alpha += (Math.random() - 0.5) * 0.02;
        if (star.alpha > 1) star.alpha = 1;
        if (star.alpha < 0) star.alpha = 0;
      });

      animationFrameId.current = requestAnimationFrame(animateStars); // 다음 프레임 요청
    };

    animateStars(); // 애니메이션 시작

    // 컴포넌트 언마운트 시 클린업 함수
    return () => {
      window.removeEventListener('resize', resizeCanvas); // 리사이즈 이벤트 리스너 제거
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current); // 애니메이션 프레임 중지
      }
    };
  }, []); // 이펙트는 컴포넌트 마운트 시 한 번만 실행됩니다.

  return <canvas ref={canvasRef} className="absolute inset-0 z-0"></canvas>;
};

export default SpaceBackground;

