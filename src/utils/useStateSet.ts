import { useState } from "react";
import { todoListType, tempTodoListType, tempButtonStateType } from "./Type";

export function useStateSet() {
  // 1. 클라이언트용
  const [tempTodoList, setTempTodoList] = useState<tempTodoListType[]>([]);
  const [TempId, setTempId] = useState<number>(1); // tempTodoList에 추가시켜주기위한 ID
  const [tempButtonState, setTempButtonState] = useState<tempButtonStateType[]>(
    []
  ); // tempTodoList 버튼 토글용 State

  // 2. 백엔드용
  const [todoList, setTodoList] = useState<todoListType[]>([]); //투두리스트 저장소
  const [buttonState, setButtonState] = useState<tempButtonStateType[]>([]); //투두리스트 버튼 상태 저장소

  // 3. 토스트용
  const [selectedDeleteStatet, setSelectedDelete] = useState<number>(0);
  const [originTempState, setOriginTempState] = useState<boolean>(false);
  const [toastToggle, setToastToggle] = useState<boolean>(false);

  return {
    tempTodoList,
    TempId,
    tempButtonState,
    todoList,
    buttonState,
    selectedDeleteStatet,
    originTempState,
    setTempTodoList,
    setTempId,
    setTempButtonState,
    toastToggle,
    setTodoList,
    setButtonState,
    setSelectedDelete,
    setOriginTempState,
    setToastToggle,
  };
}
