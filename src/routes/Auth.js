import React, {useState} from "react";

const Auth = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    /*
    * onChange 함수 : 이메일,비밀번호 따로 만들지 않기 위한 것
    * 함수의 파라미터에서도 비구조화 할당을 할 수 있다.
    *
    * */
    const onChange = (event) => {
        const {target : {name,value}} = event;
        if(name === "email"){
            setEmail(value);
        } else if (name === "password"){
            setPassword(value)
        }
    }
    const onSubmit = (event) => {
        event.preventDefault();
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
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
                <input type="submit" value="logIn"/>
            </form>

            <div>
                <button>Continue with Google</button>
                <button>Continue with Github</button>
            </div>
        </div>
    )

};


    export default Auth;