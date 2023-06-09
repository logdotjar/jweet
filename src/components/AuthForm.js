import React, {useState} from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {authService} from "../fbase";


const AuthForm = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    /*
    * onChange 함수 : 이메일,비밀번호 따로 만들지 않기 위한 것
    * 함수의 파라미터에서도 비구조화 할당을 할 수 있다.
    * 값이 바뀔때마다 onChange 함수를 호출해서 사용한다.
    * event parameter 는 input의 변경이 일어났는지 의미
    * target의 value는 키보드로 입력된 값
    * */
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target : {name,value}} = event;
        if(name === "email"){
            setEmail(value);
        } else if (name === "password"){
            setPassword(value)
        }
    };
    const onSubmit = async(event) => {
        event.preventDefault();
        try{
            let data;
            // form 제출하면서 로그인 혹은 계정생성 버튼 보여주기
            if(newAccount){
                // 계정생성하기
                data = await createUserWithEmailAndPassword(
                    authService,
                    email, password
                )
            } else {
                // 로그인하기
                data = await signInWithEmailAndPassword(
                    authService,
                    email, password
                )
            }
            console.log(data);
        } catch(error){
            setError(error.message);
        }
    }

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return(
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={email}
                    onChange={onChange}
                    required
                    className="authInput"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={onChange}
                    required
                    className="authInput"
                />
                <input
                    type="submit"
                    value={newAccount ? "계정 생성하기 " : "로그인"}
                    className="authInput authSubmit"
                />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "가입하기" : "계정 생성하기"}
            </span>
        </>
    )
}

export default AuthForm;