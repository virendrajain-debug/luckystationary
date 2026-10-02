const WORDS = [
  "Pens",
  "Notebooks",
  "Files & Folders",
  "Art & Craft",
  "Sketch Books",
  "Cricket Gear",
  "Footballs",
  "Rackets",
  "Board Games",
  "Puzzles",
  "Gift Wrap",
  "School Bags",
  "Geometry Boxes",
  "Water Bottles",
  "Diaries",
  "Colours & Brushes",
];

/** Infinite marquee strip — pure CSS, duplicated track for a seamless loop. */
export default function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center gap-8">
          <span className="text-lg font-extrabold whitespace-nowrap sm:text-2xl">{w}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" className="shrink-0 text-sun-deep" aria-hidden="true">
            <path d="M12 2l2.6 6.9L21.5 11l-6.9 2.1L12 20l-2.6-6.9L2.5 11l6.9-2.1L12 2z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="mask-fade-x overflow-hidden border-y border-ink/8 bg-paper-2 py-5 select-none"
      aria-label="Products we stock: pens, notebooks, files, art and craft, sports gear, games and gifts"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
