import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// 서버 주소 (나중에 본인의 Render 서버 주소로 꼭 바꿔야 함!)
const socket = io("/"); 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [nickname, setNickname] = useState("");
  const [user, setUser] = useState(null);

  // 서버 응답 처리
  useEffect(() => {
    socket.on("registerResult", (res) => {
      alert(res.success ? "가입 성공! 로그인해주세요." : res.msg);
      if (res.success) setIsRegistering(false);
    });

    socket.on("loginResult", (res) => {
      if (res.success) {
        setIsLoggedIn(true);
        setUser(res.user);
      } else {
        alert(res.msg);
      }
    });
  }, []);

  const handleRegister = () => socket.emit("register", { id, pw, nickname });
  const handleLogin = () => socket.emit("login", { id, pw });

  if (!isLoggedIn) {
    return (
      <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f5f5f5", height: "100vh" }}>
        <h2 style={{ color: "#333" }}>{isRegistering ? "회원가입" : "로그인"}</h2>
        <input type="text" placeholder="아이디" onChange={(e) => setId(e.target.value)} style={inputStyle} /><br/>
        <input type="password" placeholder="비밀번호" onChange={(e) => setPw(e.target.value)} style={inputStyle} /><br/>
        
        {isRegistering && (
          <input type="text" placeholder="닉네임" onChange={(e) => setNickname(e.target.value)} style={inputStyle} />
        )}

        <button onClick={isRegistering ? handleRegister : handleLogin} style={btnStyle}>
          {isRegistering ? "가입하기" : "로그인"}
        </button>
        <p onClick={() => setIsRegistering(!isRegistering)} style={{ cursor: "pointer", color: "blue" }}>
          {isRegistering ? "이미 계정이 있나요?" : "회원이 아니신가요?"}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h3>반갑습니다, {user.nickname}님!</h3>
      <p>보유 포인트: {user.point}P</p>
      <div style={{ border: "1px solid #ccc", height: "300px", marginBottom: "10px" }}>
        {/* 채팅 메시지 표시 영역 */}
      </div>
      <input type="text" placeholder="메시지를 입력하세요 (10P 차감)" style={{ width: "70%" }} />
      <button style={btnStyle}>전송</button>
    </div>
  );
}

const inputStyle = { padding: "10px", margin: "5px", width: "80%", borderRadius: "5px", border: "1px solid #ddd" };
const btnStyle = { padding: "10px 20px", marginTop: "10px", backgroundColor: "#fee500", border: "none", borderRadius: "5px", fontWeight: "bold" };

export default App;
