import React, { useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";


function App() {
  // useState 유저 로그인여부를 체크
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  return (
      <AppRouter isLoggedIn={isLoggedIn}/>
  );
}

export default App;
