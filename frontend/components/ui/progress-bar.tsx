import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, max = 100, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-200", className)} {...props}>
      <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
