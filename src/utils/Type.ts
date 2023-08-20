export interface todoListType {
  id: number | undefined;
  content: string | undefined;
  isCompleted: boolean | undefined;
  createdDateTime: string | undefined;
  updatedDateTime: string | undefined;
}

export interface tempTodoListType {
  id: number | undefined;
  content: string | undefined;
  isCompleted: boolean | undefined;
}

export interface tempButtonStateType {
  id: number;
  tempBool: boolean;
}
