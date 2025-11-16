export type PaginationModel = {
  page: number;
  pageSize: number;
};

export type SortModel = {
  field: string;
  sort: "asc" | "desc";
}[];