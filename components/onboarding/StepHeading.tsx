import { cn } from "@/lib/utils";

type StepHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

/** Consistent title + subtitle block for each onboarding screen. */
export function StepHeading({
  title,
  description,
  align = "left",
  className,
}: StepHeadingProps) {
  return (
    <div className={cn(align === "center" ? "text-center" : "text-left", className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      )}
    </div>
  );
}
