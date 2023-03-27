import React , {useState} from "react";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";
import { updateProfile } from "@firebase/auth";

// import {
//     collection,
//     getDocs,
//     query,
//     where,
//     orderBy
// } from "@firebase/firestore";

export default ({ refreshUser , userObj }) => {
    const history = useHistory();
    const [newDisplayName,setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/")
    }
    const onChange = (event) => {
        const{
            target: {value}
        } = event;
        setNewDisplayName(value);
    }
    const onSubmit = async(event) => {
        event.preventDefault();
        const{
            target: {value}
        } = event;

        //변경사항 없으면 업데이트X ,변경 됐을때만 업데이트
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(userObj, { displayName: newDisplayName });
            refreshUser();
        }
    }




    // 내 트윗 얻어오는 함수
    /*
    const getMyJweets = async () => {
        // 내 트윗 dbService 컬렉션 jweets Docs에서 내림차순으로 가져오기
        const q = query(
            collection(dbService, "jweets"),
            where('creatorId', '==', `${userObj.uid}`),
            orderBy("createdAt", "desc")
        );

        // getDocs()메서드로 쿼리 결과 값
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });

    }

    //내 jweets에서 얻은 function 호출
    useEffect(() => {
        getMyJweets();
    }, [userObj]);
     */


  return (
      <>
          <form onSubmit={onSubmit}>
              <input
                  type="text"
                  placeholder="유저 이름"
                  value={newDisplayName}
                  onChange={onChange}
              />
              <input type="submit" value="프로필 수정하기"/>
          </form>
          <button onClick={onLogOutClick}>Log Out</button>
      </>
  )
};