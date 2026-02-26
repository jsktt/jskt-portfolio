import { IMAGES } from "../../assets/assets";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main className={styles.container}>
      <section className={styles.leftSection}></section>

      <section className={styles.imageSection}>
        <img src={IMAGES.LANDING.CARL_SCHURZ} alt="Carl Schurz Park" />

        <div className={styles.imageCaption}>
          <span>CARL SCHURZ PARK, NYC</span>
          <span>SHOT ON IPHONE X</span>
        </div>
      </section>

      <section className={styles.leftSection}></section>
    </main>
  );
};

export default Home;
