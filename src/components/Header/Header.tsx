import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.email);
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <a href="/" onClick={(e) => {
          if (window.location.pathname === "/") {
            e.preventDefault();
            window.location.reload();
          }
        }}>JUNSUNG KIM</a>{" "}
      </div>

      {/* {user ? <Link to="/projects/new"> NEW PROJECT </Link> : <p>{""}</p>} */}
      {user ? <Link to="/writings/new"> NEW WRITING </Link> : <p>{""}</p>}

      <nav className={styles.right}>
        <Link to="/about" state={{ backgroundLocation: location }}>
          ABOUT
        </Link>
        {/* <Link to="/projects">PROJECTS</Link> */}
        <Link to="/writings">WRITINGS</Link>
      </nav>
    </header>
  );
};

export default Header;
