import {
  Image as ImageIcon,
  Video as VideoIcon,
  Music as AudioIcon,
  FileText,
  File as DefaultFileIcon,
} from "lucide-react";

function getFileType(extension: string) {
  switch (extension) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "image";

    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
      return "video";

    case "mp3":
    case "wav":
      return "audio";

    case "pdf":
    case "doc":
    case "docx":
    case "txt":
      return "document";

    default:
      return "file";
  }
}

type FileThumbnailProps = Pick<File, "name">;

export function FileThumbnail({ name }: FileThumbnailProps) {
  const extension = name.split(".").pop()?.toLowerCase();
  const fileType = extension ? getFileType(extension) : "file";

  const size = 32; // similar to MUI "large" icon

  switch (fileType) {
    case "image":
      return <ImageIcon size={size} className="text-primary" />;

    case "video":
      return <VideoIcon size={size} className="text-primary" />;

    case "audio":
      return <AudioIcon size={size} className="text-primary" />;

    case "document":
      return <FileText size={size} className="text-primary" />;

    default:
      return <DefaultFileIcon size={size} className="text-primary" />;
  }
}
