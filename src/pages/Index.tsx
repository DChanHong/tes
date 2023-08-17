import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { todoListType, tempTodoListType, tempButtonStateType } from "Type";

const Index = () => {
  //useState 모음

  //1. 임시용
  const [tempTodoList, setTempTodoList] = useState<tempTodoListType[]>([]);
  const [TempId, setTempId] = useState<number>(1); // tempTodoList에 추가시켜주기위한 ID
  const [tempButtonState, setTempButtonState] = useState<tempButtonStateType[]>(
    []
  ); // tempTodoList 버튼 토글용 State

  //2.  본 데이터용
  const [todoList, setTodoList] = useState<todoListType[]>([]); //투두리스트 저장소
  const [buttonState, setButtonState] = useState<tempButtonStateType[]>([]); //투두리스트 버튼 상태 저장소

  //useRef 모음

  //1. 본 데이터용
  const deleteRef = useRef<{ [key: number]: HTMLDivElement | null }>({}); //삭제하기용
  const checkRef = useRef<{ [key: number]: HTMLInputElement | null }>({}); // 체크박스용
  const commentRef = useRef<{ [key: number]: HTMLDivElement | null }>({}); // 코멘트 추출용
  const modifyRef = useRef<{ [key: number]: HTMLInputElement | null }>({}); // 수정하기 inpu Ref

  //2. 임시용
  const tempCheckRef = useRef<{ [key: number]: HTMLInputElement | null }>({}); //체크박스용 Ref
  const tempDataRef = useRef<{ [key: number]: HTMLDivElement | null }>({}); // 처음 출력시 보여줄 content Ref
  const tempModifyRef = useRef<{ [key: number]: HTMLInputElement | null }>({}); //수정하기용 input Ref
  const tempDeleteRef = useRef<{ [key: number]: HTMLDivElement | null }>({}); //삭제하기 버튼용 Ref

  //3.  추가하기 용
  const addDataRef = useRef<HTMLInputElement>(null);

  // 각 api 함수들

  // (1) 전체데이터 가져오기

  //최초 todoList에 데이터가 들어올 때 , 임시 데이터에 마지막 요소의 id정보를 저장

  /* 저장된 todoList 함수  시작 */
  //전체데이터 부르기
  const getData = async () => {
    try {
      const result = await axios.get("http://localhost:8080/api/v1/todos");
      setTodoList(result.data.value);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  // 본 데이터 할 일 완료 함수
  const complete = (data: number) => {
    if (checkRef.current[data] && commentRef.current[data]) {
      // 현재 체크 상태를 가져온다.
      const checked = checkRef.current[data]?.checked;
      // 해당 id의 현재 체크상태를 idCompleted 속성에 담아준다.
      const newArray = todoList.map((item) =>
        item.id === data ? { ...item, idCompleted: checked } : item
      );
      setTodoList(newArray);
    }
  };

  // 본 데이터 수정하기 함수
  const modify = (data: number) => {
    // id를 받아와서 해당 id의 상태를 true로 전환시킨다.
    const newArray = buttonState.map((item) =>
      item.id === data ? { ...item, tempBool: true } : item
    );
    setButtonState(newArray);
  };

  // 본 데이터 삭제기하기 버튼
  const deleteComment = (data: number) => {
    // 해당 태그 삭제 api 실행
    if (
      window.confirm(
        "message: 할 일을 삭제하시겠습니까? \n삭제 한 할 일은 복구할 수 없습니다."
      )
    ) {
      // 삭제 api 호출
      try {
        const result = axios.delete(
          `http://localhost:8080/api/v1/todos/${data}`
        );
      } catch (error) {
        console.error(error);
      }

      //임시 tempTodo에서도 삭제
      const newArr = todoList.filter((item) => item.id !== data);
      setTodoList(newArr);
    } else {
      return;
    }
  };

  // 본 데이터 저장하기 버튼
  const save = async (data: number) => {
    const modifyContent = modifyRef.current[data]?.value; //해당 텍스트를 불러옴
    // 해당 텍스트로 수정 api 실행
    try {
      //해당 콘텐츠가 삭제되어있는지 확인
      const result = await axios.get(
        `http://localhost:8080/api/v1/todos/${data}`
      );
    } catch (error) {
      // catch로 넘어온 경우 해당 데이터가 삭제된 것이므로 , 해당 state 없애기

      const arr = todoList.filter((item) => item.id !== data);
      setTodoList(arr);
      alert("이미 삭제된 [할 일]입니다.");
      return;
    }

    // 실행 후 , 기존 내용 수정 텍스트로 변경해주고 , 버튼 토글시키기
    // 수정 api 실행
    try {
      const result = await axios.patch(
        `http://localhost:8080/api/v1/todos/${data}`,
        {
          content: modifyContent,
          isCompleted: false,
        }
      );
    } catch (error) {
      console.error(error);
    }

    // 바뀐 콘텐트 바꾸기용 Array 완료버튼 false로 변경 및 콘텐츠 변경
    const newtodoArray = todoList.map((item) =>
      item.id === data
        ? { ...item, content: modifyContent, idCompleted: false }
        : item
    );

    setTodoList(newtodoArray);

    // 바뀐 버튼 토클용 Array
    const newButtonToggleArray = buttonState.map((item) =>
      item.id === data ? { ...item, tempBool: !item.tempBool } : item
    );
    setButtonState(newButtonToggleArray);

    // 저장했으니, 원래 체크되있던 체크버튼 확인용 state false로 변경 및 체크박스 unchekced부여

    const inputElement = checkRef.current[data];
    if (inputElement) {
      inputElement.checked = false;
    }
  };

  const cancel = (data: number) => {
    //id를 받아와서 해당 id를 false로 전환시킨다.
    const newArray = buttonState.map((item) =>
      item.id === data ? { ...item, tempBool: false } : item
    );
    setButtonState(newArray);
  };
  /*  임시 데이터용 함수들  시작*/
  useEffect(() => {
    if (todoList.length > 0) {
      const numberId = Number(todoList[todoList.length - 1].id) + 1;
      setTempId(numberId);
    }
    // 본 데이터 버튼 토글용
    const arr = todoList.map((item) => ({
      id: Number(item.id),
      tempBool: false,
    }));
    setButtonState(arr);
  }, [todoList]);

  //할 일 추가하기 버튼
  const AddTodo = async () => {
    //10개 이상 데이터가 존재하는지 확인
    if (todoList.length + tempTodoList.length < 10) {
      try {
        const content = addDataRef.current?.value;

        if (content === "") {
          alert("내용을 입력해 주세요.");
          addDataRef.current?.focus();
          return;
        } else {
          // 임시 ID랑 DB의 ID를 맞춰주어 임시 생성창을 저장해준다.
          setTempId(TempId + 1);

          const TempData = { id: TempId, content: content, isCompleted: false };
          setTempTodoList([...tempTodoList, TempData]);
          const TempButtonData = { id: TempId, tempBool: false };
          setTempButtonState([...tempButtonState, TempButtonData]);

          if (addDataRef.current) {
            addDataRef.current.value = "";
          }

          // DB에 저장 API 호출

          const axiosData = { content: content };
          try {
            const result = await axios.post(
              "http://localhost:8080/api/v1/todos",
              axiosData
            );
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("[할 일]은 최대 10개까지 등록할 수 있습니다.");
      if (addDataRef.current) {
        addDataRef.current.value = "";
      }
    }
  };

  // 임시 창 체크박스 밑줄 추가하기
  const tempComplete = (data: number) => {
    if (tempCheckRef.current[data] && tempDataRef.current[data]) {
      const checked = tempCheckRef.current[data]?.checked;

      const newArray = tempTodoList.map((item) =>
        item.id === data ? { ...item, isCompleted: checked } : item
      );
      setTempTodoList(newArray);
    }
  };

  // 임시 창 수정 버튼
  const tempModify = (data: number) => {
    // id를 받아와서 해당 id의 상태를 true로 전환시킨다.
    const newArray = tempButtonState.map((item) =>
      item.id === data ? { ...item, tempBool: true } : item
    );
    setTempButtonState(newArray);
  };

  // 임시 창 취소 버튼
  const tempCancel = (data: number) => {
    //id를 받아와서 해당 id를 false로 전환시킨다.
    const newArray = tempButtonState.map((item) =>
      item.id === data ? { ...item, tempBool: false } : item
    );
    setTempButtonState(newArray);
  };

  // 임시 창 저장하기 버튼
  const tempSave = async (data: number) => {
    // 세션에서 삭제된 id인지 확인 삭제됐으면 hidden
    const modifyContent = tempModifyRef.current[data]?.value; //해당 텍스트를 불러옴
    // 해당 텍스트로 수정 api 실행
    try {
      //해당 콘텐츠가 삭제되어있는지 확인
      const result = await axios.get(
        `http://localhost:8080/api/v1/todos/${data}`
      );
    } catch (error) {
      // catch로 넘어온 경우 해당 데이터가 삭제된 것이므로 , 해당 state 없애기

      const arr = tempTodoList.filter((item) => item.id !== data);
      setTempTodoList(arr);
      alert("이미 삭제된 [할 일]입니다.");
      return;
    }

    // 실행 후 , 기존 내용 수정 텍스트로 변경해주고 , 버튼 토글시키기
    // 수정 api 실행
    try {
      const result = axios.patch(`http://localhost:8080/api/v1/todos/${data}`, {
        content: modifyContent,
        isCompleted: false,
      });
    } catch (error) {
      console.error(error);
    }

    // 바뀐 콘텐트 바꾸기용 Array
    const newtodoArray = tempTodoList.map((item) =>
      item.id === data
        ? { ...item, content: modifyContent, isCompleted: false }
        : item
    );
    setTempTodoList(newtodoArray);

    // 바뀐 버튼 토클용 Array
    const newButtonToggleArray = tempButtonState.map((item) =>
      item.id === data ? { ...item, tempBool: !item.tempBool } : item
    );
    setTempButtonState(newButtonToggleArray);

    // 내용이 수정되었으니,  체크박스 unchekced부여
    const inputElement = tempCheckRef.current[data];
    if (inputElement) {
      inputElement.checked = false;
    }
  };

  // 임시 창 삭제
  const tempDelete = (data: number) => {
    // 해당 태그 삭제 api 실행
    if (
      window.confirm(
        "message: 할 일을 삭제하시겠습니까? \n삭제 한 할 일은 복구할 수 없습니다."
      )
    ) {
      // 삭제 api 호출
      try {
        const result = axios.delete(
          `http://localhost:8080/api/v1/todos/${data}`
        );
      } catch (error) {
        console.error(error);
      }

      //임시 tempTodo에서도 삭제
      const newArr = tempTodoList.filter((item) => item.id !== data);
      setTempTodoList(newArr);
    } else {
      return;
    }
  };

  return (
    <div className=" w-6/12 mx-auto">
      {/* Title */}
      <div className="py-6 bg-[#4C3C8E] mx-auto"></div>
      <div className="flex justify-beteween  border- mx-auto">
        <h1 className="text-[#4C3C8E] text-[40px] ml-4 font-bold pt-7 pl-8 pb-2">
          TO DO LIST
        </h1>
      </div>
      {/* 할일 추가하는 버튼 */}
      <div className="flex justify-center mx-4 mb-8">
        <input
          type="text"
          className="border-2 w-10/12 text-[15px] rounded-xl pl-2 p-2 mr-2"
          placeholder="내용을 입력한 후, 오른쪽에 [할 일 추가]를 클릭해 주세요."
          maxLength={50}
          ref={addDataRef}
        />
        <button
          type="button"
          onClick={AddTodo}
          className="border-2 w-2/12 rounded-xl text-[15px]"
        >
          할 일 추가
        </button>
      </div>
      {/* 할 일 보여주기 */}

      {todoList.length + tempTodoList.length === 0 ? (
        <div className=" mt-10  text-center ">
          <span className="text-[20px] text-gray-400 border-2 border-x-white border-t-white border-[#796CAE] p-4 ">
            등록된 [할 일]이 없습니다.
          </span>
        </div>
      ) : (
        <div>
          {/* 본 데이터 보여주기창 */}
          {todoList
            .sort(
              (a, b) =>
                new Date(String(a.createdDateTime)).getTime() -
                new Date(String(b.createdDateTime)).getTime()
            )
            .map((item, index) => (
              <div
                key={index}
                ref={(ref) => (deleteRef.current[Number(item.id)] = ref)}
                className="flex w-full  border-2 border-[#796CAE] border-x-white border-t-white mb-7 pb-2"
              >
                <div className="w-1/12 ">
                  <input
                    type="checkbox"
                    className="w-6 h-6 ml-10 mt-1.5"
                    ref={(ref) => (checkRef.current[Number(item.id)] = ref)}
                    onClick={() => complete(Number(item.id))}
                  />
                </div>
                {buttonState
                  .filter((data) => data.id === item.id)
                  .map((data, index) => (
                    <div key={index} className="w-10/12 ml-10">
                      {!data.tempBool ? (
                        <div className="flex justify-between">
                          <div
                            ref={(ref) =>
                              (commentRef.current[Number(item.id)] = ref)
                            }
                            className={`${
                              !item.idCompleted ? "" : "line-through"
                            } w-9/12  p-1 pl-3`}
                          >
                            {item.content}
                          </div>
                          <div className="w-3/12">
                            <button
                              type="button"
                              className=" p-1 px-2 bg-[#E3DAF2] text-[#48218C] rounded-xl"
                              onClick={() => modify(Number(item.id))}
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              className=" p-1 ml-2 px-2 mx-1 bg-[#E3DAF2] text-[#48218C] rounded-xl"
                              onClick={() => deleteComment(Number(item.id))}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <input
                            className="border-2 outline-none w-9/12 p-1 px-2 mr-1 rounded-xl border-[#796CAE]"
                            type="text"
                            defaultValue={item.content}
                            ref={(ref) =>
                              (modifyRef.current[Number(item.id)] = ref)
                            }
                            maxLength={50}
                          />
                          <div className="w-3/12">
                            <button
                              type="button"
                              className=" p-1  px-2 bg-[#D9E6F1] text-[#1F4786] rounded-xl"
                              onClick={() => save(Number(item.id))}
                            >
                              저장
                            </button>
                            <button
                              type="button"
                              className=" p-1 ml-2 px-2 mx-1 bg-[#D9E6F1] text-[#1F4786] rounded-xl"
                              onClick={() => cancel(Number(item.id))}
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          {/* 여기서부턴 임시 보여주기창 */}
          {tempTodoList.map((item, index) => (
            <div
              ref={(ref) => (tempDeleteRef.current[Number(item.id)] = ref)}
              className="flex w-full  border-2 border-[#796CAE] border-x-white border-t-white mb-7 pb-2"
              key={index}
            >
              {/* 체크 박스 */}
              <div className="w-1/12 ">
                <input
                  type="checkbox"
                  className="w-6 h-6 ml-10 mt-1.5"
                  ref={(ref) => (tempCheckRef.current[Number(item.id)] = ref)}
                  onClick={() => tempComplete(Number(item.id))}
                />
              </div>

              {tempButtonState
                .filter((data) => data.id === item.id)
                .map((data, index) => (
                  <div key={index} className="w-10/12 ml-10">
                    {/* 변경불가 텍스트 상자 ,수정 삭제 ,버튼 박스 */}
                    {!data.tempBool ? (
                      <div className="flex justify-between">
                        <div
                          ref={(ref) =>
                            (tempDataRef.current[Number(item.id)] = ref)
                          }
                          className={` ${
                            !item.isCompleted ? "" : "line-through"
                          }  w-9/12  p-1 pl-3 `}
                        >
                          {item.content}
                        </div>
                        <div className="w-3/12">
                          <button
                            type="button"
                            className=" p-1 px-2 bg-[#E3DAF2] text-[#48218C] rounded-xl"
                            onClick={() => tempModify(Number(item.id))}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className=" p-1 ml-2 px-2 mx-1 bg-[#E3DAF2] text-[#48218C] rounded-xl"
                            onClick={() => tempDelete(Number(item.id))}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <input
                          className="border-2 outline-none w-9/12 p-1 px-2 mr-1 rounded-xl border-[#796CAE]"
                          type="text"
                          defaultValue={item.content}
                          ref={(ref) =>
                            (tempModifyRef.current[Number(item.id)] = ref)
                          }
                          maxLength={50}
                        />
                        <div className="w-3/12">
                          <button
                            type="button"
                            className=" p-1  px-2 bg-[#D9E6F1] text-[#1F4786] rounded-xl"
                            onClick={() => tempSave(Number(item.id))}
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            className=" p-1 ml-2 px-2 mx-1 bg-[#D9E6F1] text-[#1F4786] rounded-xl"
                            onClick={() => tempCancel(Number(item.id))}
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
