import { useNavigate } from "react-router-dom";
import styles from "./About.module.css";
import { authApi } from "../../api/authApi";
import LoginAuth from "../../provider/LoginAuth";

const About = () => {
  const navigate = useNavigate();
  const isLoggedIn = LoginAuth();
  const handleClose = () => {
    navigate(-1);
  };

  const handleAuth = () => {
    if (isLoggedIn) {
      authApi.signout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p> DESIGNER & FULLSTACK ENGINEER </p>
        <br />

        <p className={styles.text}>
          안녕하세요, 저는 <span onClick={() => handleAuth()}>김준성</span>
          입니다.
        </p>
        <p>디자인과 코딩을 통해 문제를 해결하는 엔지니어입니다.</p>
        <p>
          미니멀한 디자인으로 진심이 와닿는 스토리텔링을 추구하며, 디테일을
          중요시합니다.
        </p>
        <p>취미로 디자인 연구하거나, 요리하는거 좋아합니다.</p>

        <br />
        <p>기술 스택:</p>
        <p>Frontend: React, Typescript, Redux</p>
        <p>Backend: Spring Boot, Redis, postgresql, Docker, EC2</p>
        <p>Languages: Python, Java, Typescript</p>

        <div className={styles.footer}>
          <div className={styles.left}>
            <a href="https://github.com/jsktt">GITHUB</a>
            <a href="https://www.linkedin.com/in/junsung-kim99/">LINKEDIN</a>
          </div>
          <div className={styles.right}>
            <span>UITOMDE@GMAIL.COM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
