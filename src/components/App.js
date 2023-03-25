import AppRouter from "components/Router";
import React, { useState,useEffect } from "react";
// import { authService } from "fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";



function App() {
  const [init, setInit] = useState(false);
  // useState 유저 로그인여부를 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // app.js는 모든 요소들의 위에 있기때문에  authorization 전부를 다룸. -> 누가 접속했는지 알려줄 수 있음 -> 페이지 변경할때 사용 !
  const [userObj,setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user);
        const uid = user.uid;
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
      <>
        {init ? <AppRouter isLoggedIn={isLoggedIn} userObje={userObj}/> : "초기화..."}
        <footer>&copy; {new Date().getFullYear()} Jwitter :)</footer>
      </>
  );
}

export default App;
