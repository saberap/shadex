import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

export function AlertDemo() {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="btn btn-outline">نمایش دیالوگ </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>آیا کاملاً مطمئن هستید؟</AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات قابل بازگشت نیست. این کار حساب شما را برای همیشه از
              سرورهای ما حذف خواهد کرد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction>ادامه</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
