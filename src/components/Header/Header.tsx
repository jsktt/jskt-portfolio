import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { authApi } from "../../api/authApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.email);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignout = () => {
    authApi.signout();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/">JUNSUNG KIM</Link>{" "}
      </div>

      {user ? <Link to="/projects/new"> NEW PROJECT </Link> : <p>{""}</p>}
      {user ? <Link to="/writings/new"> NEW WRITING </Link> : <p>{""}</p>}

      <nav className={styles.right}>
        <Link to="/about" state={{ backgroundLocation: location }}>
          ABOUT
        </Link>
        <Link to="/projects">PROJECTS</Link>
        <Link to="/writings">WRITINGS</Link>

      </nav>
    </header>
  );
};

export default Header;
