import type { Accept, FileRejection } from "react-dropzone";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export type UploadFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress: number;
  status: UploadStatus;
  error?: string;
};

export type FileUploadVariant = "default" | "image" | "avatar";

export type FileUploadOnUpload = (
  file: UploadFile,
  signal: AbortSignal,
  onProgress: (progress: number) => void,
) => Promise<void>;

export type FileUploadProps = {
  variant?: FileUploadVariant;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
  maxFiles?: number;
  accept?: Accept;
  className?: string;
  description?: string;
  emptyLabel?: string;
  emptyHint?: string;
  value?: UploadFile[];
  onChange?: (files: UploadFile[]) => void;
  onUpload?: FileUploadOnUpload;
  onRemove?: (file: UploadFile) => void;
  onReject?: (rejections: FileRejection[]) => void;
};

export type FileUploadDropzoneProps = {
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
  maxFiles?: number;
  accept?: Accept;
  variant?: FileUploadVariant;
  className?: string;
  emptyLabel?: string;
  emptyHint?: string;
  hasFiles?: boolean;
  onDrop: (accepted: File[], rejections: FileRejection[]) => void;
};

export type FileUploadItemProps = {
  file: UploadFile;
  onRemove?: (file: UploadFile) => void;
  onRetry?: (file: UploadFile) => void;
  className?: string;
};

export type FileUploadProgressProps = {
  value: number;
  status: UploadStatus;
  className?: string;
};
