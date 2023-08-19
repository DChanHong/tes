import React, { MutableRefObject } from "react";
import {
  todoListType,
  tempButtonStateType,
  tempTodoListType,
} from "utils/Type";

interface Props {
  item: todoListType | tempTodoListType;

  buttonState: tempButtonStateType[];

  onCheckRef: MutableRefObject<{ [key: number]: HTMLInputElement | null }>;
  onModifyRef: MutableRefObject<{ [key: number]: HTMLInputElement | null }>;
  onCommentRef: MutableRefObject<{ [key: number]: HTMLDivElement | null }>;

  onModify: (data: number) => void;
  onComplete: (data: number) => void;
  onShowDeleteToast: (data: number) => void;
  onSave: (data: number) => void;
  onCancel: (data: number) => void;
}
/*  
    checkRef
    modifyRef
    commentRef
*/

const TodoItem: React.FC<Props> = ({
  item,

  buttonState,
  onCancel,
  onSave,
  onModify,
  onComplete,
  onShowDeleteToast,
  onCheckRef,
  onModifyRef,
  onCommentRef,
}) => {
  return (
    <div className="flex w-full  border-2 border-[#796CAE] border-x-white border-t-white mb-7 pb-2">
      <div className="w-1/12 ">
        <input
          type="checkbox"
          className="w-6 h-6 ml-10 mt-1.5"
          ref={(ref) => (onCheckRef.current[Number(item.id)] = ref)}
          onClick={() => onComplete(Number(item.id))}
        />
      </div>
      {buttonState
        .filter((data) => data.id === item.id)
        .map((data, index) => (
          <div key={index} className="w-10/12 ml-10">
            {!data.tempBool ? (
              <div className="flex justify-between">
                <div
                  ref={(ref) => (onCommentRef.current[Number(item.id)] = ref)}
                  className={`${
                    !item.idCompleted ? "" : "line-through"
                  } w-9/12  p-1 pl-3`}
                >
                  {item.content}
                </div>
                <div className="flex w-3/12">
                  <button
                    type="button"
                    className=" p-1 px-2 bg-[#E3DAF2] text-[#48218C] rounded-xl"
                    onClick={() => onModify(Number(item.id))}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className=" p-1 ml-2 px-2 mx-1 bg-[#E3DAF2] text-[#48218C] rounded-xl"
                    onClick={() => onShowDeleteToast(Number(item.id))}
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
                  ref={(ref) => (onModifyRef.current[Number(item.id)] = ref)}
                  maxLength={50}
                />
                <div className="flex w-3/12">
                  <button
                    type="button"
                    className=" p-1  px-2 bg-[#D9E6F1] text-[#1F4786] rounded-xl"
                    onClick={() => onSave(Number(item.id))}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className=" p-1 ml-2 px-2 mx-1 bg-[#D9E6F1] text-[#1F4786] rounded-xl"
                    onClick={() => onCancel(Number(item.id))}
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default TodoItem;
