import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { authApi } from "../../api/authApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";


const Header = () => {
  const user = useSelector((state: RootState) => state.auth.email);
  const navigate = useNavigate(); 
  const handleSignout = () => {
    authApi.signout();
    navigate("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}> 준성이의 포트폴리오 </div>
      <nav className={styles.nav}>
        <Link to="/about">About Me</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/blog">Blog</Link>

        {user ? (
          <span onClick={handleSignout}>{user}</span>
          ) : (
          <Link to="/login">Login</Link>)}
      </nav>
    </header>
  );
};

export default Header;
