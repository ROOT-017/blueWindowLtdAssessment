export interface ITaskResponse {
  id: number;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface ITaskListResponse {
  data: ITaskResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
