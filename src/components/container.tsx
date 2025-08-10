import { cn } from "@/lib/utils";

type ContainerProps = {
  id?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Container({ id, children, className }: ContainerProps) {
  return (
    <section id={id} className={cn("container mx-auto flex gap-6 bg-black/60 rounded-2xl overflow-hidden my-4 md:my-6 text-white p-6 z-30 shadow-2xl backdrop-blur-sm", className)}>
      {children}
    </section>
  );
}
