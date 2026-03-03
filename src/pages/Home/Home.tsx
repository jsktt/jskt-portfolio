import { IMAGES } from "../../assets/assets";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>

        <section className={styles.imageSection}>
          <img src={IMAGES.LANDING.CARL_SCHURZ} alt="Carl Schurz Park" />
          <div className={styles.imageCaption}>
            <span>CARL SCHURZ PARK, NYC</span>
            <span>SHOT ON IPHONE X</span>

          </div>
        </section>
      </div>

      <div className={styles.right}>
        <span className={styles.intro}> 안녕하세요! 풀스텍 개발자 김준성이라고 합니다 </span>
      </div>
    </div>

  );
};

export default Home;
