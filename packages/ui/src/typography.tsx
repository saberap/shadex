import classNames from "classnames";
import type { CSSProperties, FC, ReactNode } from "react";

export interface ITypography {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  dir?: "rtl" | "ltr";
}

const TypographyH1: FC<ITypography> = ({ children, className, style }) => {
  return (
    <h1
      className={classNames(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className,
      )}
      style={style}
    >
      {children}
    </h1>
  );
};

const TypographyH2: FC<ITypography> = ({ children, className, style }) => {
  return (
    <h2
      className={classNames(
        "scroll-m-20 pb-2 text-3xl tracking-tight first:mt-0",
        className,
      )}
      style={style}
    >
      {children}
    </h2>
  );
};

const TypographyH3: FC<ITypography> = ({ children, className, style }) => {
  return (
    <h3
      className={classNames(
        "scroll-m-20 text-[18px]  tracking-tight",
        className,
      )}
      style={style}
    >
      {children}
    </h3>
  );
};

const TypographyH4: FC<ITypography> = ({ children, className, style }) => {
  return (
    <h4
      className={classNames(
        "scroll-m-20 text-[16px] tracking-tight",
        className,
      )}
      style={style}
    >
      {children}
    </h4>
  );
};

const TypographyP: FC<ITypography> = ({ children, dir, className, style }) => {
  return (
    <p
      dir={dir}
      className={classNames("leading-7 text-sm ", className)}
      style={style}
    >
      {children}
    </p>
  );
};

const TypographyLarge: FC<ITypography> = ({ children, className, style }) => {
  return (
    <div className={classNames("text-2xl", className)} style={style}>
      {children}
    </div>
  );
};

const TypographySmall: FC<ITypography> = ({ children, className, style }) => {
  return (
    <small
      className={classNames("text-xs leading-none", className)}
      style={style}
    >
      {children}
    </small>
  );
};

const TypographyMuted: FC<ITypography> = ({ children, className, style }) => {
  return (
    <p
      className={classNames("text-muted-foreground text-sm", className)}
      style={style}
    >
      {children}
    </p>
  );
};

const TypographySpan: FC<ITypography> = ({ children, className, style }) => {
  return (
    <span className={classNames("text-sm", className)} style={style}>
      {children}
    </span>
  );
};

const Typography: FC<ITypography> = ({ children, dir, className, style }) => {
  return (
    <span
      dir={dir}
      className={classNames("font-normal text-sm", className)}
      style={style}
    >
      {children}
    </span>
  );
};

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyLarge,
  TypographySmall,
  TypographyMuted,
  TypographySpan,
  Typography,
};
