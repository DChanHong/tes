import React, { MutableRefObject } from "react";
import { tempTodoListType, tempButtonStateType } from "utils/Type";

interface Props {
  item: tempTodoListType;
  index: number;
  tempButtonState: tempButtonStateType[];

  onTempCheckRef: MutableRefObject<{ [key: number]: HTMLInputElement | null }>;
  onTempModifyRef: MutableRefObject<{ [key: number]: HTMLInputElement | null }>;
  onTempCommentRef: MutableRefObject<{ [key: number]: HTMLDivElement | null }>;

  onTempModify: (data: number) => void;
  onTempSave: (data: number) => void;
  onTempCancel: (data: number) => void;
  onShowTempDeleteToast: (data: number) => void;
  onTempComplete: (data: number) => void;
}

const TempTodoItem: React.FC<Props> = ({
  item,
  index,
  tempButtonState,
  onTempCheckRef,
  onTempModifyRef,
  onTempCommentRef,
  onTempModify,
  onTempSave,
  onTempCancel,
  onShowTempDeleteToast,
  onTempComplete,
}) => {
  return (
    <div
      className="flex w-full  border-2 border-[#796CAE] border-x-white border-t-white mb-7 pb-2"
      key={index}
    >
      <div className="w-1/12 ">
        <input
          type="checkbox"
          className="w-6 h-6 ml-10 mt-1.5"
          ref={(ref) => (onTempCheckRef.current[Number(item.id)] = ref)}
          onClick={() => onTempComplete(Number(item.id))}
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
                    (onTempCommentRef.current[Number(item.id)] = ref)
                  }
                  className={` ${
                    !item.idCompleted ? "" : "line-through"
                  }  w-9/12  p-1 pl-3 `}
                >
                  {item.content}
                </div>
                <div className="flex w-3/12">
                  <button
                    type="button"
                    className=" p-1 px-2 bg-[#E3DAF2] text-[#48218C] rounded-xl"
                    onClick={() => onTempModify(Number(item.id))}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className=" p-1 ml-2 px-2 mx-1 bg-[#E3DAF2] text-[#48218C] rounded-xl"
                    onClick={() => onShowTempDeleteToast(Number(item.id))}
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
                    (onTempModifyRef.current[Number(item.id)] = ref)
                  }
                  maxLength={50}
                />
                <div className="flex w-3/12">
                  <button
                    type="button"
                    className=" p-1  px-2 bg-[#D9E6F1] text-[#1F4786] rounded-xl"
                    onClick={() => onTempSave(Number(item.id))}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className=" p-1 ml-2 px-2 mx-1 bg-[#D9E6F1] text-[#1F4786] rounded-xl"
                    onClick={() => onTempCancel(Number(item.id))}
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

export default TempTodoItem;
