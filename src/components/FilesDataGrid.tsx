import { useMemo, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
// import { Trash2 } from "lucide-react";
import { FileThumbnail } from "@/components/FileThumbnail";
// import { FileQuickActions } from "@/components/FileQuickActions";
import type { FileDataGridRow } from "@/types/FileDataGridRow";
import { useFileManagerStore } from "@/hooks/useFileManagerStore";
// import { useConfirm } from "@/hooks/useConfirm";
import { useFilesQuery } from "@/hooks/useFilesQuery";
// import { useFileDeleteMutation } from "@/hooks/useFileDeleteMutation";
import { convertByteToMegabyte } from "@/utils/utility";
// import { BulkActions } from "@/shared/ui/BulkActions";

export function FilesDataGrid() {
//   const confirm = useConfirm();

//   const fileDeleteMutation = useFileDeleteMutation();

  const selectedFileIds = useFileManagerStore((s) => s.selectedFileIds);
  const updateSelectedFileIds = useFileManagerStore((s) => s.updateSelectedFileIds);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [sortModel, setSortModel] = useState([
    { field: "dateUploaded", sort: "desc" as const },
  ]);

  const filesQuery = useFilesQuery({ paginationModel, sortModel });
  const rowCountRef = useRef(filesQuery.data?.totalFilesCount || 0);

  const rowCount = useMemo(() => {
    if (filesQuery.data?.totalFilesCount !== undefined) {
      rowCountRef.current = filesQuery.data.totalFilesCount;
    }
    return rowCountRef.current;
  }, [filesQuery.data?.totalFilesCount]);

  const rows = filesQuery.data?.files || [];

  // -----------------------------
  // Row-selection handling
  // -----------------------------
  function toggleRowSelection(id: string) {
    const next = selectedFileIds.includes(id)
      ? selectedFileIds.filter((x) => x !== id)
      : [...selectedFileIds, id];

    updateSelectedFileIds(next);
  }

  function toggleSelectAll() {
    if (selectedFileIds.length === rows.length) {
      updateSelectedFileIds([]);
    } else {
      updateSelectedFileIds(rows.map((r) => r.id.toString()));
    }
  }

  // -----------------------------
  // Delete selected
  // -----------------------------
//   function handleRemoveFiles() {
    // confirm({
    //   handleConfirm: () => {
    //     fileDeleteMutation.mutate(selectedFileIds, {
    //       onSuccess: () => updateSelectedFileIds([]),
    //     });
    //   },
    // });
//   }

  return (
    <>
      {/* TABLE CONTAINER */}
      <div className="border rounded-xl w-full max-h-[calc(100dvh-300px)] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Checkbox header */}
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedFileIds.length === rows.length && rows.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => setSortModel([{ field: "filename", sort: "asc" }])}
              >
                File Name
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => setSortModel([{ field: "size", sort: "asc" }])}
              >
                Size
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() =>
                  setSortModel([{ field: "dateUploaded", sort: "desc" }])
                }
              >
                Date Uploaded
              </TableHead>

              {/* <TableHead className="text-right">Actions</TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {(rows || []).map((row: FileDataGridRow) => {
              const id = row.id.toString();
              const isSelected = selectedFileIds.includes(id);

              return (
                <TableRow key={id} data-state={isSelected ? "selected" : undefined}>
                  {/* Selection checkbox */}
                  <TableCell className="w-12">
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleRowSelection(id)} />
                  </TableCell>

                  {/* File Name + Icon */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileThumbnail name={row.filename} />
                      <span className="font-medium">{row.filename}</span>
                    </div>
                  </TableCell>

                  <TableCell>{convertByteToMegabyte(row.size)}</TableCell>

                  <TableCell>{new Date(row.dateUploaded).toDateString()}</TableCell>

                  {/* <TableCell className="text-right">
                    <FileQuickActions {...row} />
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination footer */}
        <div className="p-3 flex items-center justify-between border-t bg-muted/30">
          <span className="text-sm text-muted-foreground">
            Page {paginationModel.page + 1} of{" "}
            {Math.ceil(rowCount / paginationModel.pageSize) || 1}
          </span>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={paginationModel.page === 0}
              onClick={() =>
                setPaginationModel((p) => ({ ...p, page: p.page - 1 }))
              }
            >
              Previous
            </Button>

            <Button
            type="button"
              variant="outline"
              size="sm"
              disabled={(paginationModel.page + 1) * paginationModel.pageSize >= rowCount}
              onClick={() =>
                setPaginationModel((p) => ({ ...p, page: p.page + 1 }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions (Delete selected files) */}
      {/* <BulkActions
        actions={[
          {
            icon: <Trash2 />,
            actionFn: handleRemoveFiles,
            label: "Delete files",
          },
        ]}
        ids={selectedFileIds}
      /> */}
    </>
  );
}
