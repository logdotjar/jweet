import React, {useState} from "react";
import {getDownloadURL, ref, uploadString} from "@firebase/storage";
import {dbService, storageService} from "../fbase";
import {v4} from "uuid";
import {addDoc, collection} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const JweetFactory = ({userObj }) => {
    const [jweet,setJweet] = useState("");
    // 텍스트만 트윗하고 싶을때 + 텍스트와 이미지를 트윗하고 싶을때 기본 값 "" 설정
    const [attachment,setAttachment] = useState("");

    const onSubmit = async (event) => {

        if (jweet === "") {
            return;
        }

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

    const onClearAttachment = (event) =>  setAttachment("");

    return(
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    type="text"
                    placeholder="무슨 일이 일어나고 있나요?"
                    maxLength={120}
                    value={jweet}
                    onChange={onChange}
                    className="factoryInput__input"
                />
                <input type="submit" value="Jweet :)" className="factoryInput__arrow"/>
                <label htmlFor="attach-file" className="factoryInput__label">
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus} />
                    <input
                        id="attach-file"
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        style={{
                            opacity: 0,
                        }}
                    />
                </label>
                {attachment && (
                    <div className="factoryForm__attachment">
                        <img
                            src={attachment}
                            style={{backgroundImage: attachment}}
                        />
                        <div className="factoryForm__clear" onClick={onClearAttachment}>
                            <span>사진 삭제</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                )}
            </div>


        </form>
    )
}

export default JweetFactory;