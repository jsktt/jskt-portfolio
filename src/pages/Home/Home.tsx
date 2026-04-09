import { useMemo, useState } from "react";
import { IMAGES, LANDING_DESCRIPTIONS } from "../../assets/assets";
import styles from "./Home.module.css";

type ImageKey = keyof typeof IMAGES.LANDING;

const PLANES: { width: number; keys: ImageKey[] }[] = [
  { width: 300, keys: ["CARL_SCHURZ", "TIMES_SQUARE", "MAPLECREST", "GRAND_CENTRAL"] },
  { width: 200, keys: ["JEJU", "BRIDGE", "DANTES"] },
  { width: 250, keys: ["ST_PANCRAS", "DUSABLE_BRIDGE", "GASAN"] },
];

const ALL_IMAGES = PLANES.flatMap((p) => p.keys);

const Home = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [keyword, setKeyword] = useState<ImageKey | null>(null);

  const mobileImageKey = useMemo(
    () => ALL_IMAGES[Math.floor(Math.random() * ALL_IMAGES.length)],
    []
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    setPosition({ x, y });
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className={styles.main}
      style={{ "--x": position.x, "--y": position.y } as React.CSSProperties}
    >
      {PLANES.map((plane, i) => (
        <div key={i} className={styles.plane}>
          {plane.keys.map((key) => (
            <img
              key={key}
              onClick={() => setKeyword(key)}
              src={IMAGES.LANDING[key]}
              alt={LANDING_DESCRIPTIONS[key]}
              width={plane.width}
            />
          ))}
        </div>
      ))}

      <div className={styles.mobileImage}>
        <img
          onClick={() => setKeyword(mobileImageKey)}
          src={IMAGES.LANDING[mobileImageKey]}
          alt={LANDING_DESCRIPTIONS[mobileImageKey]}
          width={280}
        />
      </div>

      {keyword && (
        <div className={styles.overlay} onClick={() => setKeyword(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p>{LANDING_DESCRIPTIONS[keyword]}</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
