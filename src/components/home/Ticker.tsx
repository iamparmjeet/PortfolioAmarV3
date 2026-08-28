import { tickerWords } from "@/lib/data";

/** Big serif marquee (Design A) — a statement strip, not a footnote. */
export function Ticker() {
  const items = [...tickerWords, ...tickerWords];

  return (
    <div className="overflow-hidden border-y border-hairline py-6">
      <div className="marquee-track">
        {items.map((word, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: list is static and duplicated for the loop
            key={`${word}-${i}`}
            className="display flex items-center gap-9 whitespace-nowrap pr-9 text-[clamp(32px,5vw,72px)] text-bone"
          >
            {word}
            <svg
              className="h-6 w-6 flex-shrink-0 text-accent md:h-8 md:w-8"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
