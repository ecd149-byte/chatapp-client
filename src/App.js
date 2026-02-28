import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// 본인의 Render 서버 주소로 자동 연결
const socket = io("/"); 

function App() {
  const [screen, setScreen] = useState("login"); // login, register, lobby, chat
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 회원가입 결과 처리
    socket.on("registerResult", (res) => {
      if (res.success) {
        alert("가입을 축하합니다! 로그인 해주세요.");
        setScreen("login"); // 가입 성공 시 로그인창으로
      } else {
        alert(res.msg);
      }
    });

    // 로그인 결과 처리
    socket.on("loginResult", (res) => {
      if (res.success) {
        setUser(res.user);
        setScreen("lobby"); // 로그인 성공 시 '대기실'로 이동!
      } else {
        alert(res.msg);
      }
    });

    return () => {
      socket.off("registerResult");
      socket.off("loginResult");
    };
  }, []);

  // 기능 함수들
  const handleRegister = () => {
    if(!id || !pw || !nickname) return alert("모든 항목을 입력해주세요.");
    socket.emit("register", { id, pw, nickname });
  };

  const handleLogin = () => {
    socket.emit("login", { id, pw });
  };

  // 1. 로그인 화면
  if (screen === "login") {
    return (
      <div style={containerStyle}>
        <h2 style={titleStyle}>로그인</h2>
        <input type="text" placeholder="아이디" onChange={(e) => setId(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="비밀번호" onChange={(e) => setPw(e.target.value)} style={inputStyle} />
        <button onClick={handleLogin} style={yellowBtnStyle}>로그인</button>
        <p onClick={() => setScreen("register")} style={linkStyle}>회원이 아니신가요? (회원가입)</p>
      </div>
    );
  }

  // 2. 회원가입 화면
  if (screen === "register") {
    return (
      <div style={containerStyle}>
        <h2 style={titleStyle}>회원가입</h2>
        <input type="text" placeholder="아이디" onChange={(e) => setId(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="비밀번호" onChange={(e) => setPw(e.target.value)} style={inputStyle} />
        <input type="text" placeholder="닉네임" onChange={(e) => setNickname(e.target.value)} style={inputStyle} />
        <button onClick={handleRegister} style={yellowBtnStyle}>가입하기</button>
        <p onClick={() => setScreen("login")} style={linkStyle}>이미 계정이 있나요?</p>
      </div>
    );
  }

  // 3. 기본 대기화면 (로비)
  if (screen === "lobby") {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <span>{user.nickname}님 환영합니다!</span>
          <span style={{fontWeight: "bold", color: "#f39c12"}}> {user.point}P</span>
        </div>
        <div style={lobbyBoxStyle}>
          <h4>📢 공지사항</h4>
          <p style={{fontSize: "13px"}}>클린한 채팅 문화를 만들어주세요.</p>
          <hr/>
          <button onClick={() => setScreen("chat")} style={enterBtnStyle}>자유 채팅방 입장하기</button>
        </div>
        <button onClick={() => setScreen("login")} style={logoutBtnStyle}>로그아웃</button>
      </div>
    );
  }

  // 4. 채팅 화면 (임시)
  return (
    <div style={containerStyle}>
      <h3>채팅방</h3>
      <button onClick={() => setScreen("lobby")}>뒤로가기</button>
    </div>
  );
}

// --- 스타일 (수다/킹톡 느낌) ---
const containerStyle = { padding: "40px 20px", textAlign: "center", backgroundColor: "#f9f9f9", height: "100vh" };
const titleStyle = { marginBottom: "30px", fontWeight: "800" };
const inputStyle = { padding: "12px", margin: "8px 0", width: "90%", borderRadius: "8px", border: "1px solid #ddd" };
const yellowBtnStyle = { padding: "12px", width: "95%", backgroundColor: "#fee500", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const linkStyle = { marginTop: "20px", color: "#555", cursor: "pointer", fontSize: "14px", textDecoration: "underline" };
const headerStyle = { display: "flex", justifyContent: "space-between", padding: "15px", backgroundColor: "#fff", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" };
const lobbyBoxStyle = { backgroundColor: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };
const enterBtnStyle = { padding: "15px", width: "100%", backgroundColor: "#4a90e2", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", marginTop: "10px" };
const logoutBtnStyle = { marginTop: "30px", background: "none", border: "none", color: "#999", textDecoration: "underline" };

export default App;
