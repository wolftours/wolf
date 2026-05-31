import styles from "./Marquee.module.css";

const DEFAULT_ITEMS = [
  "Paris",
  "Rome",
  "Barcelona",
  "Louvre",
  "Vatican",
  "Sagrada Familia",
  "Private entries",
  "Golden hour",
];

type MarqueeProps = {
  items?: string[];
};

export function Marquee({ items = DEFAULT_ITEMS }: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {track.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
