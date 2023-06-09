import React, {useState} from "react";
import {
    dbService,
    storageService
} from "fbase";
import { doc, deleteDoc, updateDoc }from "firebase/firestore";
import {
    deleteObject,
    ref
} from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";


const Jweet = ({ jweetObj, isOwner }) => {
    // 내가 작성자일 경우 버튼이 보일 수 있게 함

    //수정할 수 있는 상태인지 알려주기 위한 것
    const [editing,setEditing] = useState(false);
    //수정 input에 입력된 text 업데이트
    const [newJweet , setNewJweet] = useState(jweetObj.text);
    const onDeleteJweet = doc(dbService , "jweets", `${jweetObj.id}`);

    // 삭제하려는 이미지 파일 가리키는 ref 생성하기
    // jweetObj의 attachmentUrl이 바로 삭제하려는 URL임
    const desertRef = ref(storageService, jweetObj.attachmentUrl);

    const onDeleteClick = async() => {
        const ok = window.confirm("정말 삭제하시겠습니까?");
        if(ok){
            try{
                await deleteDoc(onDeleteJweet);

                if(jweetObj.attachmentUrl !== ""){
                    await deleteObject(desertRef);
                }


            } catch (error){
                window.alert("삭제를 실패했습니다.")
            }

        }
    }

    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(doc(dbService, `jweets/${jweetObj.id}`), {
            text: newJweet,
        });
        setEditing(false);  // 더이상 수정 하지 못하도록 false 처리
    }
    const onChange = (event) => {
        const {
            target : {value}
        } = event;
        setNewJweet(value);
    }

    return(
        <div>
            {
                editing ?
                    (
                        <>
                            <form onSubmit={onSubmit} className="container nweetEdit">
                                <input
                                    type="text"
                                    value={newJweet}
                                    onChange={onChange}
                                    placeholder="수정할 내용을 입력해주세요"
                                    required
                                />
                            </form>
                            <input type="submit" value="Jweet 업데이트하기" className="formBtn"/>
                            <button onClick={toggleEditing} className="formBtn cancelBtn">취소</button>
                        </>
                    )
                    :
                    (
                        <>
                            <h4>{jweetObj.text}</h4>
                            { jweetObj.attachmentUrl && <img src={jweetObj.attachmentUrl} width="50px"/> }
                            {isOwner &&
                                <div className="nweet__actions">
                                       <span onClick={onDeleteClick}>
                                            <FontAwesomeIcon icon={faTrash} />
                                      </span>
                                    <span onClick={toggleEditing}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </span>
                                </div>
                            }
                        </>
                    )
            }

        </div>
    )
}

export default Jweet;