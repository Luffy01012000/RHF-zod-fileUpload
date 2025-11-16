import type { FileDataGridRow } from "@/types/FileDataGridRow";
import { useQuery } from "@tanstack/react-query";
import type { PaginationModel, SortModel } from "@/types/dataGrid";
import { useFileManagerStore } from "./useFileManagerStore";

// --- MOCK DATABASE ----------------------------------------------------------
const MOCK_FILES: FileDataGridRow[] = Array.from({ length: 93 }).map((_, i) => ({
  id: String(i + 1),
  filename: `file_${i + 1}.jpg`,
  size: Math.floor(Math.random() * 5_000_000),
  dateUploaded: new Date(
    Date.now() - Math.floor(Math.random() * 500000000)
  ).toISOString(),
}));

// --- MOCK REQUEST ------------------------------------------------------------
export function mockFetchFiles({
    files,
  page,
  pageSize,
  sortField,
  sortOrder,
}: {
    files: File[] | any,
  page: number;
  pageSize: number;
  sortField: string;
  sortOrder: "asc" | "desc" | undefined;
}) {

  return new Promise<{
    totalFilesCount: number;
    files: FileDataGridRow[];
  }>((resolve) => {
    setTimeout(() => {
    //   let data = [...MOCK_FILES];
      const data = files?.map((file,i: number)=>{
          console.log("files from file loop:",file)
        return  {
        id: String(i + 1),
        filename: file?.file?.name,
        size: file?.file?.size,
        dateUploaded: new Date(
            file?.file?.lastModified
        ).toISOString(),
        };

      }) ?? [...MOCK_FILES];
      // SORTING
      data.sort((a: any, b: any) => {
        let x = a[sortField];
        let y = b[sortField];

        if (sortField === "dateUploaded") {
          x = new Date(x).getTime();
          y = new Date(y).getTime();
        }

        if (sortOrder === "desc") return y - x;
        return x - y;
      });

      // PAGINATION
      const start = page * pageSize;
      const paginated = data.slice(start, start + pageSize);

      resolve({
        totalFilesCount: data.length,
        files: paginated,
      });
    }, 600); // simulate network latency
  });
}




export function useFilesQuery({
  paginationModel,
  sortModel,
}: {
  paginationModel: PaginationModel;
  sortModel: SortModel;
}) {
    const {dbFiles} = useFileManagerStore();
// console.log("files from mock:",files);
  return useQuery({
    queryKey: ["files", { paginationModel, sortModel }],
    queryFn: async () => {
      const sortField =
        sortModel.length > 0 ? sortModel[0].field : "dateUploaded";
      const sortOrder =
        sortModel.length > 0 ? sortModel[0].sort : ("asc" as "asc" | "desc");

      return mockFetchFiles({
        files: dbFiles,
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        sortField,
        sortOrder,
      });
    },
  });
}
