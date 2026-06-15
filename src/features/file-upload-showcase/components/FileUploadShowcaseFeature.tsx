"use client";

import { useMemo, useState } from "react";
import type { UploadFile } from "@/shared/components/file-upload";
import { FileUpload } from "@/shared/components/file-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

const MB = 1024 * 1024;

function makeUploadFile(
  partial: Pick<UploadFile, "name" | "size" | "type" | "status"> &
    Partial<Pick<UploadFile, "progress" | "error" | "preview">>,
): UploadFile {
  return {
    id: `${partial.name}-${partial.status}`,
    file: new File([], partial.name, { type: partial.type }),
    name: partial.name,
    size: partial.size,
    type: partial.type,
    progress:
      partial.progress ??
      (partial.status === "success"
        ? 100
        : partial.status === "uploading"
          ? 62
          : 0),
    status: partial.status,
    error: partial.error,
    preview: partial.preview,
  };
}

const successDemoFile: UploadFile[] = [
  makeUploadFile({
    name: "Q4-financial-report.pdf",
    size: 1_843_200,
    type: "application/pdf",
    status: "success",
  }),
];

const errorDemoFile: UploadFile[] = [
  makeUploadFile({
    name: "design-mockups.zip",
    size: 12 * MB,
    type: "application/zip",
    status: "error",
    error: "File exceeds 10 MB limit",
  }),
];

const disabledDemoFile: UploadFile[] = [
  makeUploadFile({
    name: "approved-contract.docx",
    size: 256_000,
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    status: "success",
  }),
];

type SectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function Section({ title, description, children }: SectionProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}

function StateLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

export function FileUploadShowcaseFeature() {
  const [basic, setBasic] = useState<UploadFile[]>([]);
  const [multiple, setMultiple] = useState<UploadFile[]>([]);
  const [image, setImage] = useState<UploadFile[]>([]);
  const [avatar, setAvatar] = useState<UploadFile[]>([]);
  const [docs, setDocs] = useState<UploadFile[]>([]);
  const [advanced, setAdvanced] = useState<UploadFile[]>([]);

  const imageAccept = useMemo(
    () => ({ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".svg"] }),
    [],
  );
  const docAccept = useMemo(
    () => ({
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    }),
    [],
  );
  const advancedAccept = useMemo(
    () => ({
      "image/*": [],
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
      "application/x-rar-compressed": [".rar"],
    }),
    [],
  );

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      <header className="flex flex-col gap-1.5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Component
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">File Upload</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          A polished, fully accessible upload primitive built on shadcn/ui and
          react-dropzone. Drag-and-drop, click-to-upload, progress, retry,
          validation, image and avatar variants — all from a single composable
          component.
        </p>
      </header>

      <Section
        title="Basic upload"
        description="Single file, drag-and-drop or click to select. Remove to start over."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>Live</StateLabel>
            <FileUpload
              maxSize={5 * MB}
              value={basic}
              onChange={setBasic}
              emptyLabel="Click to upload or drag and drop"
              emptyHint="Any file up to 5 MB"
            />
          </div>
          <div className="grid gap-4">
            <div>
              <StateLabel>Success</StateLabel>
              <FileUpload value={successDemoFile} onChange={() => {}} />
            </div>
            <div>
              <StateLabel>Error</StateLabel>
              <FileUpload value={errorDemoFile} onChange={() => {}} />
            </div>
            <div>
              <StateLabel>Disabled</StateLabel>
              <FileUpload
                disabled
                value={disabledDemoFile}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Multiple upload"
        description="Upload several files at once. Each row reports its own progress and can be retried or removed independently."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>Live</StateLabel>
            <FileUpload
              multiple
              maxFiles={10}
              maxSize={10 * MB}
              value={multiple}
              onChange={setMultiple}
              emptyLabel="Drop files here"
              emptyHint="Up to 10 files, 10 MB each"
            />
          </div>
          <div>
            <StateLabel>Mixed states</StateLabel>
            <FileUpload
              multiple
              value={[
                makeUploadFile({
                  name: "annual-report.pdf",
                  size: 2.4 * MB,
                  type: "application/pdf",
                  status: "success",
                }),
                makeUploadFile({
                  name: "marketing-deck.pptx",
                  size: 8.1 * MB,
                  type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  status: "uploading",
                  progress: 72,
                }),
                makeUploadFile({
                  name: "raw-footage.zip",
                  size: 64 * MB,
                  type: "application/zip",
                  status: "error",
                  error: "Connection lost — tap retry",
                }),
              ]}
              onChange={() => {}}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Image upload"
        description="Single image with inline preview. Replace or remove in a click."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>Live</StateLabel>
            <FileUpload
              variant="image"
              accept={imageAccept}
              maxSize={5 * MB}
              value={image}
              onChange={setImage}
            />
          </div>
          <div>
            <StateLabel>Empty state</StateLabel>
            <FileUpload
              variant="image"
              accept={imageAccept}
              maxSize={5 * MB}
              value={[]}
              onChange={() => {}}
              emptyLabel="Drop cover image"
              emptyHint="PNG, JPG or WEBP up to 5 MB"
            />
          </div>
        </div>
      </Section>

      <Section
        title="Avatar upload"
        description="Circular preview with change and remove actions — perfect for profile settings."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>Live</StateLabel>
            <FileUpload
              variant="avatar"
              accept={imageAccept}
              maxSize={2 * MB}
              value={avatar}
              onChange={setAvatar}
            />
          </div>
          <div>
            <StateLabel>Disabled</StateLabel>
            <FileUpload
              variant="avatar"
              disabled
              value={[]}
              onChange={() => {}}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Document upload"
        description="PDF, DOCX, XLSX, PPTX — each file type gets its own icon."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>Live</StateLabel>
            <FileUpload
              multiple
              accept={docAccept}
              maxSize={20 * MB}
              value={docs}
              onChange={setDocs}
              emptyLabel="Drop documents to upload"
              emptyHint="PDF, DOCX, XLSX, PPTX up to 20 MB"
            />
          </div>
          <div>
            <StateLabel>Sample documents</StateLabel>
            <FileUpload
              multiple
              value={[
                makeUploadFile({
                  name: "invoice-march.pdf",
                  size: 312_000,
                  type: "application/pdf",
                  status: "success",
                }),
                makeUploadFile({
                  name: "budget-2026.xlsx",
                  size: 1.1 * MB,
                  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  status: "success",
                }),
                makeUploadFile({
                  name: "board-update.pptx",
                  size: 4.2 * MB,
                  type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  status: "success",
                }),
                makeUploadFile({
                  name: "policy.docx",
                  size: 220_000,
                  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  status: "success",
                }),
              ]}
              onChange={() => {}}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Advanced upload"
        description="Multiple files, progress, success, error and retry — everything wired up end-to-end."
      >
        <div className="space-y-4">
          <FileUpload
            multiple
            maxFiles={8}
            maxSize={25 * MB}
            accept={advancedAccept}
            value={advanced}
            onChange={setAdvanced}
            emptyLabel="Click to upload or drag and drop"
            emptyHint="Images, PDF, ZIP or RAR up to 25 MB"
          />
          <Separator />
          <p className="text-xs text-muted-foreground">
            Tip — the demo upload occasionally fails to showcase the error and
            retry flow. Hit the retry icon on a failed row to try again.
          </p>
        </div>
      </Section>
    </div>
  );
}
