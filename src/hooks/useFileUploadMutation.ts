import { useFileManagerStore } from "@/hooks/useFileManagerStore";
import type { ExtendedFile } from "@/types/ExtendedFile";
// import { httpClient } from "@/httpClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFileUploadMutation() {
  const updateUploadProgress = useFileManagerStore(
    (state) => state.updateUploadProgress
  );
  const updateUploadStatus = useFileManagerStore(
    (state) => state.updateUploadStatus
  );
  const appendFiles = useFileManagerStore((state) => state.appendFiles);

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (files: ExtendedFile[]) => {
      const uploadPromises = files.map(async (file) => {
        if (file.uploadStatus === "idle") {
          updateUploadStatus(file.id, "pending");

        //   const formData = new FormData();
        //   formData.append("file", file.file);
return mockUploadRequest(file, updateUploadProgress, updateUploadStatus);
        //   return httpClient
        //     .post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        //       headers: {
        //         "Content-Type": "multipart/form-data",
        //       },
        //       onUploadProgress: (event) => {
        //         if (event.lengthComputable && event.total) {
        //           const percentComplete = Math.round(
        //             (event.loaded / event.total) * 100
        //           );
        //           updateUploadProgress(file.id, percentComplete);
        //         }
        //       },
        //     })
        //     .then(() => {
        //       updateUploadStatus(file.id, "success");
        //     })
        //     .catch(() => {
        //       updateUploadStatus(file.id, "error");
        //     });
        }
        return Promise.resolve();
      });

      await Promise.all(uploadPromises);
    },
    onMutate: (variables) => {
      appendFiles(variables.map((item) => item.file));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["files"] });
    },
  });
}

// Mock upload request with progress simulation
function mockUploadRequest(
  file: File,
  updateUploadProgress: (id: string, p: number) => void,
  updateUploadStatus: (id: string, s: "success" | "error") => void
) {
  return new Promise<void>((resolve) => {
    let progress = 0;

    // Simulate upload speed (randomized)
    const interval = setInterval(() => {
      const step = Math.floor(Math.random() * 12) + 5; // 5–17% each tick
      progress += step;

      if (progress > 100) progress = 100;

      updateUploadProgress(file.id, progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Simulate success/error (90% success rate)
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
          updateUploadStatus(file.id, "success");
          resolve();
        } else {
          updateUploadStatus(file.id, "error");
          resolve();
        }
      }
    }, 200); // emits progress every 200ms
  });
}
