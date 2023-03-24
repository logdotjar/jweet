import AppRouter from "components/Router";
import React, { useState,useEffect } from "react";
// import { authService } from "fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";



function App() {
  const [init, setInit] = useState(false);
  // useState 유저 로그인여부를 체크
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        const uid = user.uid;
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
      <>
        {init ? <AppRouter isLoggedIn={isLoggedIn}/> : "초기화..."}
        <footer>&copy; {new Date().getFullYear()} Jwitter :)</footer>
      </>
  );
}

export default App;
