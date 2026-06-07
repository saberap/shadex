"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  toast as sonnerToast,
  type ToasterProps,
} from "sonner";
import { TypographyP } from "./typography";

interface ToastProps {
  variant: "success" | "error" | "info" | "warning" | "loading";
  text: string;
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      position="top-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--sonner-bg)",
          "--normal-text": "var(--sonner-label)",
          "--border-radius": "var(--radius)",
          fontFamily: "YekanBakh",
        } as React.CSSProperties
      }
      toastOptions={{
        className: "!delay-0 ",
        duration: 5000,
      }}
      {...props}
    />
  );
};

function Toast({ text, variant }: ToastProps) {
  const icon = {
    success: <CircleCheckIcon className="size-4 c-icon-primary" />,
    error: <OctagonXIcon className="size-4 c-icon-primary" />,
    info: <InfoIcon className="size-4 c-icon-primary" />,
    warning: <TriangleAlertIcon className="size-4 c-icon-primary" />,
    loading: <Loader2Icon className="size-4 animate-spin c-icon-primary" />,
  };
  return (
    <div
      className={`p-3 rounded-lg backdrop-blur-md c-sonner-bg flex justify-start items-center gap-x-[10px]`}
    >
      {icon[variant]}
      <TypographyP className="text-sm font-normal c-sonner-label">
        {text}
      </TypographyP>
    </div>
  );
}

function createToast({ text, variant }: ToastProps) {
  return sonnerToast.custom(() => <Toast variant={variant} text={text} />);
}

// main toast function
const toast = Object.assign(
  (opts: ToastProps) => sonnerToast.custom(() => <Toast {...opts} />),
  {
    success: (opts: Omit<ToastProps, "variant">) =>
      createToast({ variant: "success", text: opts.text }),
    error: (opts: Omit<ToastProps, "variant">) =>
      createToast({ variant: "error", text: opts.text }),
    info: (opts: Omit<ToastProps, "variant">) =>
      createToast({ variant: "info", text: opts.text }),
    warning: (opts: Omit<ToastProps, "variant">) =>
      createToast({ variant: "warning", text: opts.text }),
    loading: (opts: Omit<ToastProps, "variant">) =>
      createToast({ variant: "loading", text: opts.text }),
  },
);

export { toast, Toaster };
