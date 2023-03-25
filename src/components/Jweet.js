import React, {useState} from "react";
import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";

const Jweet = ({ jweetObj, isOwner }) => {
    // 내가 작성자일 경우 버튼이 보일 수 있게 함

    //수정할 수 있는 상태인지 알려주기 위한 것
    const [editing,setEditing] = useState(false);
    //수정 input에 입력된 text 업데이트
    const [newJweet , setNewJweet] = useState(jweetObj.text);
    const onDeleteJweet = doc(dbService , "jweets", `${jweetObj.id}`)
    const onDeleteClick = async() => {
        const ok = window.confirm("정말 삭제하시겠습니까?");
        if(ok){
            await deleteDoc(onDeleteJweet);
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
                            <form onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    value={newJweet}
                                    onChange={onChange}
                                    placeholder="수정할 내용을 입력해주세요"
                                    required
                                />
                            </form>
                            <input type="submit" value="Jweet 업데이트하기"/>
                            <button onClick={toggleEditing}>취소</button>
                        </>
                    )
                    :
                    (
                        <>
                            <h4>{jweetObj.text}</h4>
                            {isOwner &&
                                <>
                                    <button onClick={onDeleteClick}>삭제하기</button>
                                    <button onClick={toggleEditing}>수정하기</button>
                                </>
                            }
                        </>
                    )
            }

        </div>
    )
}

export default Jweet;