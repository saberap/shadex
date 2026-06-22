import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "ایمیل الزامی است")
  .email("فرمت ایمیل نامعتبر است");

export const phoneSchema = z
  .string()
  .min(1, "شماره تلفن الزامی است")
  .regex(/^(\+98|0)?9\d{9}$/, "فرمت شماره تلفن نامعتبر است");

export const passwordSchema = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد");
