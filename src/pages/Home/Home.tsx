import { useMemo, useState } from "react";
import { IMAGES, LANDING_DESCRIPTIONS } from "../../assets/assets";
import styles from "./Home.module.css";

const ALL_IMAGES = Object.keys(IMAGES.LANDING) as (keyof typeof IMAGES.LANDING)[];

const Home = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [keyword, setKeyword] = useState<
    keyof typeof LANDING_DESCRIPTIONS | null
  >(null);

  const mobileImageKey = useMemo(
    () => ALL_IMAGES[Math.floor(Math.random() * ALL_IMAGES.length)],
    []
  );

  const imgState = (key: keyof typeof LANDING_DESCRIPTIONS) => {
    setKeyword(key);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // converts pixels into ratio, 0 -> left edge, 1 -> right edge
    // makes it resolution dependent.
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    setPosition({ x, y });
  };

  return (
    <main
      onMouseMove={handleMouseMove}
      className={styles.main}
      // read mouse coord and translate it to be usable in css.
      style={{ "--x": position.x, "--y": position.y } as React.CSSProperties}
    >
      <div className={styles.plane}>
        <img
          onClick={() => imgState("CARL_SCHURZ")}
          src={IMAGES.LANDING.CARL_SCHURZ}
          alt="image"
          width={300}
        />

        <img
          onClick={() => imgState("TIMES_SQUARE")}
          src={IMAGES.LANDING.TIMES_SQUARE}
          alt="image"
          width={300}
        />
        <img
          onClick={() => imgState("MAPLECREST")}
          src={IMAGES.LANDING.MAPLECREST}
          alt="image"
          width={300}
        />
        <img
          onClick={() => imgState("GRAND_CENTRAL")}
          src={IMAGES.LANDING.GRAND_CENTRAL}
          alt="image"
          width={300}
        />
      </div>
      <div className={styles.plane}>
        <img
          onClick={() => imgState("JEJU")}
          src={IMAGES.LANDING.JEJU}
          alt="image"
          width={200}
        />
        <img
          onClick={() => imgState("BRIDGE")}
          src={IMAGES.LANDING.BRIDGE}
          alt="image"
          width={200}
        />
        <img
          onClick={() => imgState("DANTES")}
          src={IMAGES.LANDING.DANTES}
          alt="image"
          width={200}
        />
      </div>
      <div className={styles.plane}>
        <img
          onClick={() => imgState("ST_PANCRAS")}
          src={IMAGES.LANDING.ST_PANCRAS}
          alt="image"
          width={250}
        />
        <img
          onClick={() => imgState("DUSABLE_BRIDGE")}
          src={IMAGES.LANDING.DUSABLE_BRIDGE}
          alt="image"
          width={250}
        />
        <img
          onClick={() => imgState("GASAN")}
          src={IMAGES.LANDING.GASAN}
          alt="image"
          width={250}
        />
      </div>

      <div className={styles.mobileImage}>
        <img
          onClick={() => setKeyword(mobileImageKey as keyof typeof LANDING_DESCRIPTIONS)}
          src={IMAGES.LANDING[mobileImageKey]}
          alt="image"
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
