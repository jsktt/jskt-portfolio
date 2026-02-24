import { Link } from "react-router-dom";
import styles from "./Header.module.css"
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}> 준성이의 포트폴리오 </div>
      <nav className={styles.nav}>
        <Link to="/about">About Me</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/blog">Blog</Link>
      </nav>
    </header>
  );
};

export default Header;
