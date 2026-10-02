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
  "Diaries",
  "Colours & Brushes",
];

/** Infinite marquee strip — pure CSS, duplicated track for a seamless loop. */
export default function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center gap-7 pr-7" aria-hidden="true">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center gap-7">
          <span className="text-lg font-extrabold whitespace-nowrap sm:text-xl">{w}</span>
          <span className="inline-block h-2 w-2 rotate-45 bg-signal" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="mask-fade-x overflow-hidden border-b-2 border-ink bg-sun py-4 select-none"
      aria-label="Products we stock: pens, notebooks, files, art and craft, sports gear, games and gifts"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
