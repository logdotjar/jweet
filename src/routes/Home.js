import React, {useEffect, useState} from "react";
import { dbService } from "fbase";
import { addDoc, collection , getDocs , query } from "firebase/firestore";

const Home = ({ userObj }) => {
    const [jweet,setJweet] = useState("");
    //입력한 Jweets를 뿌리기 위한 것
    const [jweets,setJweets] = useState([]);

    const getJweets = async() => {
        //component가 mount - async사용위해서 함수로 작성
        const q = query(collection(dbService, "jweets"));
        const querySnapshot = await getDocs(q);


        querySnapshot.forEach(document => {
           const jweetObject = {
               ...document.data(),
               id: document.id,
           }

           //이전의 jweets에 대해 배열을 리턴 (새로작성한 jweet + 이전의 jweet)
           //set함수에 값 대신 함수를 전달 할 수 있고, 리액트는 이전 값에 접근할 수 있게 해준다.
           setJweets(prev => [jweetObject, ...prev]);
       });
    }

    useEffect(()=>{
        getJweets();
    },[]);

    const onSubmit = async (event) => {
        //제출할때마다 document생성
        event.preventDefault();
        // console.log(`제출하는 jweet:${jweet}`);
        try {
            const docRef = await addDoc(collection(dbService, "jweets"), {
                text:jweet,
                createdAt: Date.now(),
                creatorId: userObj.uid
            });
        }catch (error) {
            console.error("Error adding document: ", error);
        }
        setJweet("");
    }
    const onChange = (e) => {
        setJweet(e.target.value);
    };


    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    placeholder="무슨 일이 일어나고 있나요?"
                    maxLength={120}
                    value={jweet}
                    onChange={onChange}
                />
                <input type="submit" value="Jweet :)"/>
            </form>
            <div key={jweet.id}>
                {jweets.map(jweet => <div>
                    <h4>{jweet.jweet}</h4>
                </div>)}
            </div>
        </div>
    )
}

export default Home;