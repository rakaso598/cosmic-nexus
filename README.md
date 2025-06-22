# 🌌 [Cosmic Nexus 인터랙티브 우주 테마 웹 애플리케이션](https://cosmic-nexus.vercel.app)

![Animation_uni_10](https://github.com/user-attachments/assets/890fbae2-8bbb-4915-815d-aec78679e8dc)

'Cosmic Nexus'는 Next.js로 개발된 인터랙티브 우주 테마 웹 애플리케이션 데모입니다.  
이 애플리케이션은 사용자를 익명 행성으로 시각화하여, 우주 배경에서 성장하고 상호작용하는 모습을 클라이언트 측에서 시뮬레이션합니다.  
본래 웹소켓 서버를 통한 실시간 접속 기능을 포함하지만, Vercel의 서버리스 배포 환경에서는 웹소켓 서버 유지가 어려워 시뮬레이션 모드로 대체됩니다.  

아래 드롭다운에서 웹소켓 서버를 활용한 시연 이미지를 확인하실 수 있습니다.  

<details>
<summary>메인화면 (웹소켓 서버 실행중)</summary>

![image](https://github.com/user-attachments/assets/c5450312-6c5b-4ff1-9deb-127bcd5c8c93)

</details>

<details>
<summary>행성 클릭 시 (웹소켓 서버 실행중)</summary>

![image](https://github.com/user-attachments/assets/1b69f04d-77fd-450b-8a6c-ae08176b29a2)

</details>

<details>
<summary>브라우저 콘솔 (웹소켓 서버 실행중)</summary>

![image](https://github.com/user-attachments/assets/e1b98b67-b9de-431d-b3f7-a2ae28544598)

</details>

<details>
<summary>서버 콘솔 (웹소켓 서버 실행중)</summary>

![image](https://github.com/user-attachments/assets/f4f6eef4-c10d-4074-9ef4-2079ca103e79)

</details>

---

### **기술 스택**

#### *프론트엔드*  

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-61DAFB?style=for-the-badge&logo=framer&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
  
#### *백엔드*  

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)

---

### **주요 특징**

* **인터랙티브 우주 배경**: 캔버스 기반의 반짝이는 별 배경.
* **실시간 사용자 표현 (시뮬레이션)**: 각 접속자를 고유 ID를 가진 행성으로 표현 (현재는 가상 사용자 시뮬레이션).
* **행성 성장**: 접속 시간에 따라 행성 크기 증가 (최대 크기 제한).
* **클릭 가능한 행성 정보**: 클릭 시 익명 ID, 접속 시간 등 간략한 정보 표시.
* **익명성 강조**: 'Voyager-', 'Starlight-' 등의 컨셉 ID 부여.

---

### **프로젝트 구조**

<details>
<summary>클릭하여 열기</summary>

```
cosmic-nexus/
├── app/
│   ├── layout.jsx        // 전역 레이아웃 및 HTML 기본 구조
│   ├── page.jsx          // 메인 페이지 컴포넌트
│   └── globals.css       // 전역 스타일 및 Tailwind CSS 설정
├── components/
│   ├── SpaceBackground.jsx // 캔버스 기반 우주 배경 컴포넌트
│   ├── Planet.jsx          // 개별 행성(사용자) 컴포넌트
│   └── PlanetInfoOverlay.jsx // 행성 클릭 시 정보 표시 오버레이 컴포넌트
├── hooks/
│   └── useWebSocket.jsx  // 웹소켓 통신 로직을 캡슐화한 커스텀 훅 (현재 시뮬레이션 모드)
├── lib/
│   └── utils.jsx         // 재사용 가능한 유틸리티 함수 모음 (예: UUID 생성)
├── server/                 // (선택 사항) 실제 웹소켓 백엔드 서버 디렉토리
│   ├── index.js          // Express + Socket.IO 서버 진입점
│   └── package.json      // 서버 의존성 관리
└── public/
    └── assets/             // 이미지, 아이콘 등 정적 자산 (현재 비어 있음)
```

</details>

---

### **실행 방법**

1.  저장소 클론: `git clone [당신의 저장소 URL]`
2.  의존성 설치: `npm install` 또는 `yarn install`
3.  애플리케이션 실행: `npm run dev` 또는 `yarn dev`
4.  브라우저에서 `http://localhost:3000` 접속.
    * **참고**: 현재 데모는 백엔드 서버 없이 클라이언트 시뮬레이션으로 동작하며, 여러 브라우저 탭을 열면 각 탭에서 자신의 행성과 시뮬레이션된 다른 행성을 볼 수 있습니다.

---

### **배포 고려 사항**

* **Next.js 앱 (프론트엔드)**: Vercel에 배포 권장.
* **실시간 웹소켓 서버 (백엔드)**: 현재 데모는 백엔드 필요 없음. 실제 웹소켓 기능 구현 시 Render, Fly.io, Heroku 등 장시간 실행되는 서버 호스팅 서비스에 별도 배포 필요.

---

### **향후 개선 아이디어**

* 실제 웹소켓 백엔드 연동.
* Three.js/React-Three-Fiber를 활용한 3D 우주 배경 구현.
* 사운드 디자인 추가.
* 상호작용 기능 확장 (익명 메시지, 행성 그룹화, 커스터마이징).
