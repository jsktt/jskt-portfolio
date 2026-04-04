import { useNavigate } from "react-router-dom";
import styles from "./About.module.css";
import { authApi } from "../../api/authApi";
import LoginAuth from "../../provider/LoginAuth";

const About = () => {
  const navigate = useNavigate();
  const isLoggedIn = LoginAuth();
  const handleClose = () => {
    navigate(-1);   // 뒤 페이지 로 가기
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
        <p>
          디자인과 코드로 문제를 푸는 풀스택 엔지니어입니다. 기능이 잘 작동하는 것만큼, 사용하는 사람이 자연스럽게 
          느끼는 경험을 중요하게 생각합니다. 미니멀한 디자인을 좋아하고, 디테일에서 진심이 드러난다고 믿습니다.
        </p>
        <p>개발 외에는 디자인을 탐구하거나 요리를 하며 시간을 보냅니다.</p>

        <br />
        <p>기술 스택:</p>
        <p>Languages: Java, Python, Typescript</p>
        <p>Developer Tools: Git, SpringBoot, Redis, postgreSQL, AWS EC2</p>
        <p>AWS S3, Nginx, Docker, React, Pytorch, Hugging-Face Transformers</p>

        <div className={styles.footer}>
          <div className={styles.left}>
            <a href="https://github.com/jsktt">GITHUB</a>
            <a href="https://www.linkedin.com/in/junsung-kim99/">LINKEDIN</a>
            <a href="https://www.instagram.com/junsungslens/">PHOTOGRAPHY</a>
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
