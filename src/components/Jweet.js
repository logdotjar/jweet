import React from "react";

const Jweet = ({ jweetObj, isOwner }) => {
    // 내가 작성자일 경우 버튼이 보일 수 있게 함
    return(
        <div key={jweetObj.id}>
            <h4>{jweetObj.text}</h4>
            {isOwner &&
                <>
                    <button>삭제하기</button>
                    <button>수정하기</button>
                </>
            }

        </div>
    )
}

export default Jweet;