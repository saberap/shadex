"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FileRejection } from "react-dropzone";
import type { FileUploadOnUpload, FileUploadProps, UploadFile } from "./types";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makePreview(file: File): string | undefined {
  if (typeof URL === "undefined") return undefined;
  if (!IMAGE_TYPES.includes(file.type)) return undefined;
  return URL.createObjectURL(file);
}

function toUploadFile(file: File): UploadFile {
  return {
    id: createId(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    preview: makePreview(file),
    progress: 0,
    status: "idle",
  };
}

const simulateUpload: FileUploadOnUpload = async (
  _file,
  signal,
  onProgress,
) => {
  const totalMs = 1200 + Math.random() * 2200;
  const tickMs = 120;
  const start = Date.now();

  return new Promise<void>((resolve, reject) => {
    const fail = Math.random() < 0.18;
    const failAt = fail ? 0.45 + Math.random() * 0.4 : 1.1;

    const interval = setInterval(() => {
      if (signal.aborted) {
        clearInterval(interval);
        reject(new DOMException("Aborted", "AbortError"));
        return;
      }
      const elapsed = Date.now() - start;
      const ratio = Math.min(1, elapsed / totalMs);

      if (ratio >= failAt) {
        clearInterval(interval);
        reject(new Error("خطای شبکه — آپلود ناموفق بود"));
        return;
      }

      onProgress(Math.round(ratio * 100));

      if (ratio >= 1) {
        clearInterval(interval);
        onProgress(100);
        resolve();
      }
    }, tickMs);

    signal.addEventListener(
      "abort",
      () => {
        clearInterval(interval);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true },
    );
  });
};

type UseFileUploadOptions = Pick<
  FileUploadProps,
  | "multiple"
  | "value"
  | "onChange"
  | "onUpload"
  | "onRemove"
  | "onReject"
  | "disabled"
>;

export function useFileUpload(options: UseFileUploadOptions) {
  const {
    multiple = false,
    value,
    onChange,
    onUpload,
    onRemove,
    onReject,
    disabled,
  } = options;

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<UploadFile[]>([]);
  const files = isControlled ? value : internal;

  const filesRef = useRef(files);
  filesRef.current = files;

  const controllers = useRef<Map<string, AbortController>>(new Map());

  const setFiles = useCallback(
    (updater: UploadFile[] | ((prev: UploadFile[]) => UploadFile[])) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: UploadFile[]) => UploadFile[])(filesRef.current)
          : updater;
      filesRef.current = next;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  useEffect(() => {
    return () => {
      for (const ctrl of controllers.current.values()) ctrl.abort();
      controllers.current.clear();
      for (const f of filesRef.current) {
        if (f.preview) URL.revokeObjectURL(f.preview);
      }
    };
  }, []);

  const updateFile = useCallback(
    (id: string, patch: Partial<UploadFile>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      );
    },
    [setFiles],
  );

  const runUpload = useCallback(
    async (target: UploadFile) => {
      const controller = new AbortController();
      controllers.current.set(target.id, controller);
      updateFile(target.id, {
        status: "uploading",
        progress: 0,
        error: undefined,
      });

      const handler: FileUploadOnUpload = onUpload ?? simulateUpload;

      try {
        await handler(target, controller.signal, (p) => {
          updateFile(target.id, { progress: p });
        });
        updateFile(target.id, { status: "success", progress: 100 });
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        const message =
          err instanceof Error
            ? err.message
            : "آپلود ناموفق بود. لطفاً دوباره تلاش کنید.";
        updateFile(target.id, { status: "error", error: message });
      } finally {
        controllers.current.delete(target.id);
      }
    },
    [onUpload, updateFile],
  );

  const addFiles = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (disabled) return;
      if (rejections.length > 0) onReject?.(rejections);
      if (accepted.length === 0) return;

      const incoming = accepted.map(toUploadFile);
      const next = multiple
        ? [...filesRef.current, ...incoming]
        : incoming.slice(0, 1);

      if (!multiple) {
        for (const f of filesRef.current) {
          if (f.preview) URL.revokeObjectURL(f.preview);
        }
      }

      setFiles(next);

      for (const file of incoming) {
        void runUpload(file);
      }
    },
    [disabled, multiple, onReject, runUpload, setFiles],
  );

  const removeFile = useCallback(
    (file: UploadFile) => {
      controllers.current.get(file.id)?.abort();
      controllers.current.delete(file.id);
      if (file.preview) URL.revokeObjectURL(file.preview);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      onRemove?.(file);
    },
    [onRemove, setFiles],
  );

  const retryFile = useCallback(
    (file: UploadFile) => {
      const current = filesRef.current.find((f) => f.id === file.id);
      if (!current) return;
      void runUpload(current);
    },
    [runUpload],
  );

  const clearFiles = useCallback(() => {
    for (const ctrl of controllers.current.values()) ctrl.abort();
    controllers.current.clear();
    for (const f of filesRef.current) {
      if (f.preview) URL.revokeObjectURL(f.preview);
    }
    setFiles([]);
  }, [setFiles]);

  const isUploading = useMemo(
    () => files.some((f) => f.status === "uploading"),
    [files],
  );

  return {
    files,
    addFiles,
    removeFile,
    retryFile,
    clearFiles,
    isUploading,
  };
}
