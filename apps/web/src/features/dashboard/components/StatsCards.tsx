import { Card, CardContent, CardHeader, CardTitle, cn } from "@repo/ui";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "درآمد کل",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    sub: "نسبت به ماه گذشته",
    icon: DollarSign,
  },
  {
    title: "اشتراک‌ها",
    value: "+2,350",
    change: "+180.1%",
    trend: "up",
    sub: "نسبت به ماه گذشته",
    icon: Users,
  },
  {
    title: "فروش",
    value: "+12,234",
    change: "+19%",
    trend: "up",
    sub: "نسبت به ماه گذشته",
    icon: CreditCard,
  },
  {
    title: "اکنون فعال",
    value: "+573",
    change: "+201",
    trend: "up",
    sub: "نسبت به یک ساعت گذشته",
    icon: Activity,
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                <stat.icon className="size-4 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <div className="mt-1 flex items-center gap-1">
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  stat.trend === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500",
                )}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">{stat.sub}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
