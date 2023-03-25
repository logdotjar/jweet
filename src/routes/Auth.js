import React, {useState, useEffect} from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
} from "firebase/auth";

const Auth = () => {
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
    const onSocialClick = async (event) => {
        const {target : {name}} = event;
        let provider;
        if(name == "google"){
            provider = new GoogleAuthProvider();
        }else if (name == "github"){
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(authService, provider);
        console.log(data);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={email}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={onChange}
                    required
                />
                <input
                    type="submit"
                    value={newAccount ? "계정 생성하기 " : "로그인"}
                />
                {error}
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "가입하기" : "계정 생성하기"}
            </span>
            <div>
                <button
                    name="google"
                    onClick={onSocialClick}
                >Continue with Google</button>
                <button
                    name="github"
                    onClick={onSocialClick}
                >Continue with Github</button>
            </div>
        </div>
    )

};


    export default Auth;