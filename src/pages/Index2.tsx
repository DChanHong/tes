import React, { useEffect } from "react";
import axios from "axios";
import { useRef, useState } from "react";
import { todoListType } from "Type";

const Index2 = () => {
  const [todoListState, setTodoListState] = useState<boolean>(false);
  const [todoList, setTodoList] = useState<todoListType[]>([]);
  //전체데이터 가져오기
  const getData = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/v1/todos");
      setTodoList(result.data.value);

      const newBooeanData = Array(result.data.value.length + 1).fill(false); // 버튼 관리용 스테이트
      const newContentArray = result.data.value.map(
        (data: todoListType) => data.content?.toString() || ""
      );
      const newWriteContent = [...writeData, ...newContentArray];
      setWriteData(newWriteContent);
      setWriteBooleanData(newBooeanData);
      setCheckBoxBoolean(newBooeanData);
      setTodoListState(true);
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, []);
  console.log(todoList);

  //한 개 데이터 가져오기
  const getData2 = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/v1/todos/1");
    } catch (error) {
      alert("삭제된 할 일입니다.");
    }
  };

  // 0~50개 데이터 가져오기
  // offset : 데이터를 가져오기 시작할 위치 (defalut: 0)
  // limit : 페이지당 갯수 (default: 50)
  const getData3 = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8080/api/v1/todos?offset=1&limit=3"
      );
      console.error(result.data.value);
    } catch (error) {}
  };

  //업데이트
  const patchData = async () => {
    try {
      console.log("patch");
      const result = axios.patch("http://localhost:8080/api/v1/todos/2", {
        content: "수정된 내용입니다2222.",
        isCompleted: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /*  시작   */
  const [checkboxBooelan, setCheckBoxBoolean] = useState<boolean[]>([]);
  const [writeBooleanData, setWriteBooleanData] = useState<boolean[]>([]);
  const [writeData, setWriteData] = useState<string[]>(["1"]);

  const totalWrappingRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const inputValueRef = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const inputDivValueRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const checkBoxValueRef = useRef<{ [key: number]: HTMLInputElement | null }>(
    {}
  );
  const addDataRef = useRef<HTMLInputElement>(null);

  //할일 추가
  const postData = async () => {
    try {
      if (addDataRef.current?.value) {
        const addData = addDataRef.current?.value;

        const result = axios.post("http://localhost:8080/api/v1/todos", {
          content: addData,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 투두 리스트 완료 버튼
  const completeToggle = (data: number) => {
    if (
      checkBoxValueRef.current[data] &&
      checkBoxValueRef.current[data] !== null &&
      inputDivValueRef.current[data] &&
      inputDivValueRef.current[data] !== null
    ) {
      if (checkBoxValueRef.current[data]!.checked) {
        const newArray = checkboxBooelan.slice();
        newArray[data] = !newArray[data];
        setCheckBoxBoolean(newArray);
      } else {
        const newArray = checkboxBooelan.slice();
        newArray[data] = !newArray[data];
        setCheckBoxBoolean(newArray);
      }
    }
  };

  const modify = (data: number) => {
    console.log("modify");
    // 저장,취소 버튼 보여주기위한 토글
    const newState = [...writeBooleanData];
    newState[data] = !newState[data];
    setWriteBooleanData(newState);
  };

  const cancel = (data: number) => {
    console.log("cancel");
    const newState = [...writeBooleanData];
    newState[data] = !newState[data];
    setWriteBooleanData(newState);
  };

  const save = (data: number) => {
    if (inputValueRef.current[data] && inputValueRef.current[data] !== null) {
      // 해당 데이터를 api 요청해서 삭제된 데이터인지 확인해준다.

      //  업데이트된 텍스트를 가져온다.
      const comment = inputValueRef.current[data]?.value;
      //  div 박스에 바뀐 텍스트로 바꿔준다.
      const newArray = writeData;
      newArray[data] = String(comment);
      setWriteData(newArray);
      //수정 api 실행
      try {
        console.log("patch");
        const result = axios.patch("http://localhost:8080/api/v1/todos/2", {
          content: comment,
          isCompleted: false,
        });
      } catch (error) {
        console.error(error);
      }

      //  버튼 상태를 토글해준다.
      const newState = [...writeBooleanData];
      newState[data] = !newState[data];
      setWriteBooleanData(newState);
    }
  };

  //삭제 버튼
  const deleteData = async (data: number) => {
    try {
      const result = axios.delete(`http://localhost:8080/api/v1/todos/${data}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <button className="mx-2" onClick={getData2}>
          getData2
        </button>
        <button onClick={patchData}>patchData</button>
        <button onClick={() => deleteData(3)}>deleteData</button>
      </div>

      <div className="p-1 ml-6">
        <input
          type="text"
          placeholder="내용을 입력한 후, 오른쪽에 [할 일]추가를 클릭해주세요"
          className="border-2 w-[40rem]"
          maxLength={50}
          ref={addDataRef}
        />
        <button type="button" onClick={postData}>
          할 일 추가
        </button>
      </div>
      <div>
        {todoList.map((item, index) => (
          <div
            key={index}
            ref={(ref) => (totalWrappingRef.current[Number(item?.id)] = ref)}
            className={`flex border-2 p-2 mx-10 `}
          >
            {/* 체크 버튼 */}
            <input
              type="checkbox"
              className={`mx-2`}
              ref={(ref) => (checkBoxValueRef.current[Number(item.id)] = ref)}
              onClick={() => completeToggle(Number(item.id))}
            />
            {/* 텍스트 보여줄 버튼 */}
            {!writeBooleanData[Number(item?.id)] ? (
              <div
                className={`${
                  checkboxBooelan[Number(item.id)]
                    ? "line-through bg-rose-200"
                    : ""
                } border-2 p-2`}
                ref={(ref) => (inputDivValueRef.current[Number(item.id)] = ref)}
              >
                {writeData[Number(item.id)]}
              </div>
            ) : (
              <input
                defaultValue={writeData[Number(item.id)]}
                ref={(ref) => (inputValueRef.current[Number(item.id)] = ref)}
                className={`border-2 border-black`}
              />
            )}
            {/* 버튼  */}
            {!writeBooleanData[Number(item?.id)] ? (
              <div>
                <button
                  type="button"
                  onClick={() => modify(Number(item.id))}
                  className="border-2 p-1 mx-1 bg-blue-200"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => deleteData(Number(item.id))}
                  className="border-2 p-1 mx-1 bg-blue-200"
                >
                  삭제
                </button>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  className="border-2 p-1 mx-1 bg-red-200"
                  onClick={() => save(Number(item.id))}
                >
                  저장
                </button>
                <button
                  type="button"
                  className="border-2 p-1 mx-1 bg-red-200"
                  onClick={() => cancel(Number(item.id))}
                >
                  취소
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index2;
