import AppRouter from "components/Router";
import React, { useState,useEffect } from "react";
// import { authService } from "fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { authService } from "fbase";



function App() {
  const [init, setInit] = useState(false);
  // useState 유저 로그인여부를 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // app.js는 모든 요소들의 위에 있기때문에  authorization 전부를 다룸. -> 누가 접속했는지 알려줄 수 있음 -> 페이지 변경할때 사용 !
  const [userObj,setUserObj] = useState(null);
  const [changeName,setChangeName] = useState(false);


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);

        // 일반 이메일로그인시 displayName null로 떨어짐 -> 이메일 아이디를 이름으로 넘기기
        if (user.displayName === null) {
          const userName = user.email.split("@")[0];
          user.displayName = userName;
        }
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);


  //userObj user를 새로고침해주는 함수
  const refreshUser = () => {
    setChangeName(prev=>!prev)
  }

  return (
      <>
        {init ?
            <AppRouter
                refreshUser={refreshUser}
                isLoggedIn={isLoggedIn}
                userObj={userObj}
            /> : "초기화..."}
        {/*<footer>&copy; {new Date().getFullYear()} Jwitter :)</footer>*/}
      </>
  );
}

export default App;
