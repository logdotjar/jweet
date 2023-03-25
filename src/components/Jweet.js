import React from "react";
import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";

const Jweet = ({ jweetObj, isOwner }) => {
    // 내가 작성자일 경우 버튼이 보일 수 있게 함
    const onDeleteJweet = doc(dbService , "jweets", `${jweetObj.id}`)
    const onDeleteClick = async() => {
        const ok = window.confirm("정말 삭제하시겠습니까?");
        if(ok){
            await deleteDoc(onDeleteJweet);
        }
    }
    return(
        <div key={jweetObj.id}>
            <h4>{jweetObj.text}</h4>
            {isOwner &&
                <>
                    <button onClick={onDeleteClick}>삭제하기</button>
                    <button>수정하기</button>
                </>
            }

        </div>
    )
}

export default Jweet;