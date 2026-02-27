import { useNavigate } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p> DESIGNER & FULLSTACK ENGINEER </p>
        <br />

        <p>안녕하세요, 저는 김준성입니다.</p>
        <p>디자인과 코딩을 통해 문제를 해결하는 엔지니어입니다.</p>
        <p>
          미니멀한 디자인으로 진심이 와닿는 스토리텔링을 추구하며, 
          디테일을 중요시합니다. 취미로 디자인 연구하거나, 요리하는거 좋아합니다.
        </p>
      </div>
    </div>
  );
};

export default About;
