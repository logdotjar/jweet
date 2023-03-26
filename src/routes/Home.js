import React, {useEffect, useState} from "react";
import {dbService, storageService} from "fbase";
import {
    addDoc,
    collection ,
    query ,
    orderBy ,
    onSnapshot,
} from "firebase/firestore";
import Jweet from "components/Jweet";
import {
    ref,
    uploadString ,
    getDownloadURL
} from "@firebase/storage";
import {v4} from "uuid";



const Home = ({ userObj }) => {
    const [jweet,setJweet] = useState("");
    //입력한 Jweets를 뿌리기 위한 것
    const [jweets,setJweets] = useState([]);
    // 텍스트만 트윗하고 싶을때 + 텍스트와 이미지를 트윗하고 싶을때 기본 값 "" 설정
    const [attachment,setAttachment] = useState("");

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

        let attachmentUrl = "";

        //텍스트만 업로드 하고 싶은 경우가 있으므로 attachment 있을때 코드 실행
        if(attachment !== ""){
            // 파일 경로 참조 만들기
            const fileRef = ref(storageService, `${userObj.uid}/${v4()}`);

            const response = await uploadString(fileRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
        }

        const jweetObj = {
            text: jweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }

        //트윗하기 누르면 jweetObj형태로 새로운 document생성 후 jweets 콜렉션에 넣음
        await addDoc(collection(dbService, "jweets"), jweetObj);


        //state 비워서 form 비우기
        setJweet("");

        //파일 미리보기 img src 비우기
        setAttachment("");

        /*
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
         */
    }
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setJweet(value);
    };

    const onFileChange = (event) =>{
        // onchange 이벤트로 files를 얻음
        const { target : {files}} = event;
        const picFile = files[0]; // 파일 한개만 받을 것
        const fileReader = new FileReader();
        fileReader.onloadend = (finishedEvent) => {
            const { currentTarget : {result} } = finishedEvent;
            setAttachment(result);
        }
        // 로드가 끝나면 파일을 받아오기
        fileReader.readAsDataURL(picFile);
    }

    const onClearAttachment = (event) =>  setAttachment(null);

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
                <input type="file" accept="image/* " onChange={onFileChange}/>
                <input type="submit" value="Jweet :)"/>
                {attachment && (
                    <div>
                        <img src={attachment} width="50px"/>
                        <button onClick={onClearAttachment}>사진 삭제</button>
                    </div>
                )}

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