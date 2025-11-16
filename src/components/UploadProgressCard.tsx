"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useFileManagerStore } from "@/hooks/useFileManagerStore";
import { FileThumbnail } from "@/components/FileThumbnail";
import type { ExtendedFile } from "@/types/ExtendedFile";
import { convertByteToMegabyte } from "@/utils/utility";

type Props = ExtendedFile;

export function UploadProgressCard({
  file,
  id,
  uploadStatus,
  uploadProgress,
}: Props) {
  const removeFile = useFileManagerStore((s) => s.removeFile);
  const [progress, setProgress] = useState(0);

  // Fake animation on success
  useEffect(() => {
    if (uploadStatus === "success") {
      let p = 0;

      const interval = setInterval(() => {
        p += 3;
        setProgress((v) => v + 3);

        if (p >= 100) {
          removeFile(id);
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [uploadStatus, id, removeFile]);

  const getStatusColor = useCallback(() => {
    switch (uploadStatus) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  }, [uploadStatus]);

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    removeFile(id);
  }

  return (
    <Card
      className="p-4 flex gap-4 items-start"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Avatar Thumbnail */}
      <div className="flex-shrink-0">
        <FileThumbnail name={file.name} />
      </div>

      <div className="flex-1 space-y-2">
        {/* File name */}
        <p className="font-medium text-sm">{file.name}</p>

        {/* File size */}
        <p className="text-xs text-muted-foreground">
          {convertByteToMegabyte(file.size)}
        </p>

        {/* Linear progress bar */}
        <div className="flex items-center gap-2">
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${getStatusColor()} transition-all`}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {Math.round(uploadProgress ?? 0)}%
          </p>
        </div>
      </div>

      {/* Circular progress remove button */}
      <div className="relative h-10 w-10 flex-shrink-0">
        {/* Background ring */}
        <svg className="h-full w-full rotate-[-90deg]">
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted-foreground/30"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="4"
            className="text-foreground transition-all"
            strokeDasharray={2 * Math.PI * 18}
            strokeDashoffset={
              ((100 - progress) / 100) * (2 * Math.PI * 18)
            }
            fill="none"
          />
        </svg>

        {/* Remove icon in center */}
        <button
          onClick={handleRemove}
          className="
            absolute inset-0 flex items-center justify-center 
            rounded-full bg-background hover:bg-muted transition
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
