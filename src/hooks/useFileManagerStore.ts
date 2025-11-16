import type { ExtendedFile } from "@/types/ExtendedFile";
import { create } from "zustand";

type FileState = {
  files: ExtendedFile[];
  dbFiles: ExtendedFile[];
  selectedFileIds: string[];
};

type FileActions = {
  removeFile: (id: string) => void;
  appendFiles: (acceptedFiles: File[]) => void;
  updateUploadProgress: (id: string, uploadProgress: number) => void;
  updateUploadStatus: (
    id: string,
    uploadStatus: ExtendedFile["uploadStatus"]
  ) => void;
  updateSelectedFileIds: (ids: string[]) => void;
};

type FileSlice = FileState & FileActions;

export const useFileManagerStore = create<FileSlice>()((set) => ({
  files: [],
  dbFiles: [],
  selectedFileIds: [],
  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
    })),

  appendFiles: (acceptedFiles) =>
    set((state) => {
      const notDuplicatedNewFiles: ExtendedFile[] = acceptedFiles
      .filter((file) => {
        const id = `${file.name}${file.size}`;

        // Prevent duplicates across BOTH uploaded (files) + dbFiles (API)
        const existsInFiles = state.files.some((f) => f.id === id);
        const existsInDb = state.dbFiles.some((f) => f.id === id);

        return !existsInFiles && !existsInDb;
      })
      .map((file) => ({
        file,
        id: `${file.name}${file.size}`,
        uploadStatus: "idle",
        uploadProgress: 0,
      }));
      console.log("dbFiles:",state.dbFiles)
    return {
      // pending upload queue
      files: [...state.files, ...notDuplicatedNewFiles],

      // database files (mock API + new uploads)
      dbFiles: [...state.dbFiles, ...notDuplicatedNewFiles],
    };
    }),

  updateUploadProgress: (id, uploadProgress) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, uploadProgress } : file
      ),
      dbFiles: state.dbFiles.map((file) =>
        file.id === id ? { ...file, uploadProgress } : file
      ),
    })),

  updateUploadStatus: (id, uploadStatus) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, uploadStatus } : file
      ),
      dbFiles: state.dbFiles.map((file) =>
        file.id === id ? { ...file, uploadStatus } : file
      ).filter(file=>file.uploadStatus !== "error"),
    })),
  updateSelectedFileIds: (ids) =>
    set(() => ({
      selectedFileIds: ids,
    })),
}));