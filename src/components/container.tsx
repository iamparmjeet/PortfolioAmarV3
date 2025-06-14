import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  return (
    <section className={cn("flex gap-6 bg-black/60 rounded-2xl overflow-hidden my-4 md:my-6 text-white p-6 z-30 shadow-2xl backdrop-blur-sm", className)}>
      {children}
    </section>
  );
}
