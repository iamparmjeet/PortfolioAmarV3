import { cn } from "@/lib/utils";

export function GridBackground() {
  return (
    <div className="absolute inset-0 min-h-screen w-full items-center justify-center z-0 bg-gradient-to-tr from-fuchsia-600 via-orange-800 to-amber-600 ">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:30px_30px]",
          "[background-image:linear-gradient(to_right,#262626_0.5px,transparent_0.55px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] z-0",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center  [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      {/* {children} */}
    </div>
  );
}

export function DotBackground() {
  return (
    <div className="absolute inset-0 min-h-screen w-full items-center justify-center">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:15px_15px]", // Denser pattern
          "[background-image:radial-gradient(#404040_0.5px,transparent_1.5px)]", // Larger dots
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_15%,black)] bg-black/60">
        {" "}
        {/* Stronger fade */}
      </div>
    </div>
  );
}
