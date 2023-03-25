import React, {useEffect, useState} from "react";
import { dbService } from "fbase";
import {
    addDoc,
    collection ,
    query ,
    orderBy ,
    onSnapshot
} from "firebase/firestore";
import Jweet from "components/Jweet";

const Home = ({ userObj }) => {
    const [jweet,setJweet] = useState("");
    //입력한 Jweets를 뿌리기 위한 것
    const [jweets,setJweets] = useState([]);

    /*
    // 구식방법이라 주석처리
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

     */

    useEffect(()=>{
        const q = query(
            collection(dbService, "jweets"),
            orderBy("createdAt", "desc")
        );

        onSnapshot(q, (snapshot) => {
            // 배열 ojbect 반환, foreach보다는 이걸 사용 -> 재렌더하지 않기 때문에
            const jweetArr = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setJweets(jweetArr);
        });
    },[]);

    const onSubmit = async (event) => {
        //제출할때마다 document생성
        event.preventDefault();
        // console.log(`제출하는 jweet:${jweet}`);
        try {
            const docRef = await addDoc(collection(dbService, "jweets"), {
                text: jweet,
                createdAt: Date.now(),
                creatorId: userObj.uid
            });
            console.log(docRef);
        }catch (error) {
            console.error("Error adding document: ", error);
        }
        setJweet("");
    }
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setJweet(value);
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
            <div>
                {jweets.map((jweet) => (
                    <Jweet
                        key={jweet.id}
                        jweetObj={jweet}
                        isOwner={jweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home;