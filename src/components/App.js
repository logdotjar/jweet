import React, { useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";



function App() {
  const [init, setInit] = useState(false);
  // useState 유저 로그인여부를 체크
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

  return (
      <AppRouter isLoggedIn={isLoggedIn}/>
  );
}

export default App;
