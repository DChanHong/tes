import { useRef } from "react";

export function useRefSet() {
  //1. 백엔드용
  const checkRef = useRef<{ [key: number]: HTMLInputElement | null }>({}); // 체크박스용
  const commentRef = useRef<{ [key: number]: HTMLDivElement | null }>({}); // 코멘트 추출용
  const modifyRef = useRef<{ [key: number]: HTMLInputElement | null }>({}); // 수정하기 inpu Ref
  //2. 클라이언트용
  const tempCheckRef = useRef<{ [key: number]: HTMLInputElement | null }>({}); //체크박스용 Ref
  const tempDataRef = useRef<{ [key: number]: HTMLDivElement | null }>({}); // 처음 출력시 보여줄 content Ref
  const tempModifyRef = useRef<{ [key: number]: HTMLInputElement | null }>({}); //수정하기용 input Ref

  //3.  할 일 추가하기 용
  const addDataRef = useRef<HTMLInputElement>(null);
  return {
    checkRef,
    commentRef,
    modifyRef,
    tempCheckRef,
    tempDataRef,
    tempModifyRef,
    addDataRef,
  };
}
