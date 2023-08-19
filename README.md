### 프로젝트 구조

- src
  - components
    - TodoItem.tsx ⇒ 할 일 박스
  - pages
    - Index.tsx ⇒ 메인 페이지
  - utils
    - Type.ts ⇒ 타입 interface 모음
    - useRefSet.ts ⇒ useRef 모음
    - useStateSet.ts ⇒ useState 모음

---

### 구현 방법 소개

**useState 구성**

1. 클라이언트용

- tempTodoList ⇒ 할 일 추가 후 클라이언트에서 보여주기위한 State
- tempId ⇒ 할 일 추가시 서버에 추가될 투두리스트 id와 tempTodoList의 id와 맞춰주기위한 State
- tempButtonState ⇒ 할 일의 버튼 클릭 시 다른 버튼으로 저장시켜주기위한 state

2. 백엔드에서 불러온 데이터용

- todoList ⇒ 백엔드에서 불러온 todoList 정보를 담기위한 State
- buttonState ⇒ 할 일의 버튼 클릭시 다른 버튼으로 전환시켜주기 위한 State

3. 토스트 라이브러리용

- selectedDeleteStatet ⇒ 선택된 할 일의 id를 담아주기 위한 State
- originTempState ⇒ 선택된 할 일이 클라이언트용 state인지 백엔드용 state인지 구분해주기위한 State
- toastToggle ⇒ 토스트 박스가 현재 열려있는지 확인해주기 위한 State

**1.[할 일] 추가 기능**

- todoList와 tempTodolist의 크기를 확인해 10개 데이터가 넘는지 확인
  - 10개가 넘을 경우, 경고창을 보여주며 return
- 텍스트가 빈 문자열인지 확인
  - 빈 문자열이면, 추가 input으로 focus
- 10개 미만일 경우 할일 추가 api를 추가시킨뒤 todoList와 ButtonState에 해당 정보를 추가
- 완료 후 input 태그의 택스트는 빈 칸으로 전환

**2.할 일 수정 기능**

- 수정 버튼 클릭 시 , 해당 id를 가진 buttonState를 토클시켜 저장 ,취소 버튼으로 전환
- div 태그로 보여줬던 할 일 텍스트를 input 태그로 전환
- input 값은 div 태그에 담겨 있던 텍스트를 보여주며 , 내용 진행 가능
- 저장 버튼 클릭 시 , 한 개 데이터를 요청하는 api를 실행하여 삭제된 정보가 아닌지 확인
  - 오류가 반환되면, 삭제된 데이터이므로 todoList의 해당 Id 데이터 제거
- 정상 요청이되면, 수정 api 요청
- 수정되었으므로 해당 id의 체크박스는 빈 체크박스로 변경 및 todoList의 텍스트값 변경

**3.할 일 삭제 기능**

- 삭제 버튼 클릭 시 , 토스트 라이브러리를 활용한 확인,취소창 보여주기
  - 취소 클릭 시 , 창 닫기
- 확인 클릭 시, 삭제 api 실행 및 해당 id를 가진 todoList의 요소 제거

**4.완료/완료 해제 기능**

- 할 일의 체크박스 클릭 시 , 해당 id를 가진 todoList의 idCompleted를 토글
- 텍스트 박스에 idCompleted를 확인하여 line-through 속성 부여 or 제거

**5.기타**

- todoList와 tempTodolist의 크기를 확인하여 0 이면, 등록된 [할 일]이 아닙니다 택스트 보여주기
- sort메서드를 이용하여 todoList를 생성일 기준으로 오름차순으로 보여주기
- ellipsis 처리를 위해 truncate 속성 부여
- 50글자 제한을 위해 input에 maxLength={50} 으로 설정

---

### 개발 환경

: React + TypeScript + TailwindCss 로 구성

---

### 빌드 & 실행방법

: npm start로 실행
