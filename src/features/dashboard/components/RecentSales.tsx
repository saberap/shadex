import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";

const sales = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    initials: "OM",
    status: "completed",
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    initials: "JL",
    status: "completed",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    initials: "IN",
    status: "pending",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    initials: "WK",
    status: "completed",
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    initials: "SD",
    status: "failed",
  },
  {
    name: "Ethan Brooks",
    email: "ethan.brooks@email.com",
    amount: "+$549.00",
    initials: "EB",
    status: "completed",
  },
];

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  completed: "default",
  pending: "secondary",
  failed: "destructive",
};

export function RecentSales() {
  return (
    <div className="space-y-1">
      {sales.map((sale) => (
        <div
          key={sale.email}
          className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/50 transition-colors"
        >
          <Avatar size="default">
            <AvatarFallback className="text-xs font-semibold">{sale.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none truncate">{sale.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{sale.email}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={statusVariant[sale.status]} className="text-[10px] h-5 px-1.5 capitalize">
              {sale.status}
            </Badge>
            <span className="text-sm font-semibold tabular-nums">{sale.amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
