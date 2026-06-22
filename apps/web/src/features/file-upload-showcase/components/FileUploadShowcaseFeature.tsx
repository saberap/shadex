"use client";

import type { UploadFile } from "@repo/shared";
import { FileUpload } from "@repo/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "@repo/ui";
import { useMemo, useState } from "react";

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
    error: "حجم فایل از محدودیت ۱۰ مگابایت بیشتر است",
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
          کامپوننت
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">آپلود فایل</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          یک کامپوننت آپلود حرفه‌ای و کاملاً قابل دسترسی، ساخته شده بر پایه
          shadcn/ui و react-dropzone. کشیدن و رها کردن، آپلود با کلیک، نمایش
          پیشرفت، تلاش مجدد، اعتبارسنجی و حالت‌های تصویر و آواتار — همگی در یک
          کامپوننت ترکیب‌پذیر.
        </p>
      </header>

      <Section
        title="آپلود ساده"
        description="یک فایل تکی، با کشیدن و رها کردن یا کلیک برای انتخاب. برای شروع دوباره فایل را حذف کنید."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>زنده</StateLabel>
            <FileUpload
              maxSize={5 * MB}
              value={basic}
              onChange={setBasic}
              emptyLabel="برای آپلود کلیک کنید یا فایل را بکشید و رها کنید"
              emptyHint="هر فایلی تا حجم ۵ مگابایت"
            />
          </div>
          <div className="grid gap-4">
            <div>
              <StateLabel>موفق</StateLabel>
              <FileUpload value={successDemoFile} onChange={() => {}} />
            </div>
            <div>
              <StateLabel>خطا</StateLabel>
              <FileUpload value={errorDemoFile} onChange={() => {}} />
            </div>
            <div>
              <StateLabel>غیرفعال</StateLabel>
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
        title="آپلود چندتایی"
        description="چندین فایل را به‌صورت همزمان آپلود کنید. هر ردیف پیشرفت خود را گزارش می‌دهد و می‌تواند مستقل تلاش مجدد یا حذف شود."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>زنده</StateLabel>
            <FileUpload
              multiple
              maxFiles={10}
              maxSize={10 * MB}
              value={multiple}
              onChange={setMultiple}
              emptyLabel="فایل‌ها را اینجا رها کنید"
              emptyHint="تا ۱۰ فایل، هر کدام حداکثر ۱۰ مگابایت"
            />
          </div>
          <div>
            <StateLabel>حالت‌های ترکیبی</StateLabel>
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
                  error: "ارتباط قطع شد — برای تلاش مجدد کلیک کنید",
                }),
              ]}
              onChange={() => {}}
            />
          </div>
        </div>
      </Section>

      <Section
        title="آپلود تصویر"
        description="یک تصویر تکی با پیش‌نمایش درون‌خطی. با یک کلیک جایگزین یا حذف کنید."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>زنده</StateLabel>
            <FileUpload
              variant="image"
              accept={imageAccept}
              maxSize={5 * MB}
              value={image}
              onChange={setImage}
            />
          </div>
          <div>
            <StateLabel>حالت خالی</StateLabel>
            <FileUpload
              variant="image"
              accept={imageAccept}
              maxSize={5 * MB}
              value={[]}
              onChange={() => {}}
              emptyLabel="تصویر کاور را رها کنید"
              emptyHint="PNG، JPG یا WEBP تا حجم ۵ مگابایت"
            />
          </div>
        </div>
      </Section>

      <Section
        title="آپلود آواتار"
        description="پیش‌نمایش دایره‌ای با گزینه‌های تغییر و حذف — مناسب برای تنظیمات پروفایل."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>زنده</StateLabel>
            <FileUpload
              variant="avatar"
              accept={imageAccept}
              maxSize={2 * MB}
              value={avatar}
              onChange={setAvatar}
            />
          </div>
          <div>
            <StateLabel>غیرفعال</StateLabel>
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
        title="آپلود سند"
        description="PDF، DOCX، XLSX، PPTX — هر نوع فایل آیکون مخصوص خود را دارد."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <StateLabel>زنده</StateLabel>
            <FileUpload
              multiple
              accept={docAccept}
              maxSize={20 * MB}
              value={docs}
              onChange={setDocs}
              emptyLabel="اسناد را برای آپلود رها کنید"
              emptyHint="PDF، DOCX، XLSX، PPTX تا حجم ۲۰ مگابایت"
            />
          </div>
          <div>
            <StateLabel>اسناد نمونه</StateLabel>
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
        title="آپلود پیشرفته"
        description="چند فایل، پیشرفت، موفقیت، خطا و تلاش مجدد — همه چیز به‌صورت یکپارچه پیاده‌سازی شده است."
      >
        <div className="space-y-4">
          <FileUpload
            multiple
            maxFiles={8}
            maxSize={25 * MB}
            accept={advancedAccept}
            value={advanced}
            onChange={setAdvanced}
            emptyLabel="برای آپلود کلیک کنید یا فایل را بکشید و رها کنید"
            emptyHint="تصاویر، PDF، ZIP یا RAR تا حجم ۲۵ مگابایت"
          />
          <Separator />
          <p className="text-xs text-muted-foreground">
            نکته — آپلود نمونه گاهی به‌صورت تصادفی شکست می‌خورد تا روند نمایش خطا
            و تلاش مجدد را نشان دهد. برای تلاش دوباره، روی آیکون تلاش مجدد در
            ردیف ناموفق کلیک کنید.
          </p>
        </div>
      </Section>
    </div>
  );
}
