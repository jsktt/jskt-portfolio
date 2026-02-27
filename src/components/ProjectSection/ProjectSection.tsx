import { useNavigate } from "react-router-dom";
import { IMAGES } from "../../assets/assets";
import styles from "./ProjectSection.module.css";

type ProjectData = {
  id: number;
  title: string;
  category: string; // PERSONAL/TEAM
  description: string;
};

type Props = {
  project: ProjectData;
};

const ProjectSection = ({ project }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <section className={styles.projectsection} onClick={handleClick}>
      <div className={styles.projectleft}>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <span>{project.category}</span>
      </div>

      <div className={styles.projectright}>
        <img src={IMAGES.LANDING.CARL_SCHURZ} alt={project.title} />
      </div>
    </section>
  );
};

export default ProjectSection;
