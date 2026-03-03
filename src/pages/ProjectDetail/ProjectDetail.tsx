import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";
import ReactMarkdown from "react-markdown";
import styles from "./ProjectDetail.module.css";
import LoginAuth from "../../provider/LoginAuth";

type Project = {
  id: number;
  title: string;
  content: string;
  status: string;
  category: string;
  start_date: string;
  end_date?: string;
  project_url?: string;
  additional_url?: string;
  cover_image_url?: string;
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const isLoggedIn = LoginAuth();

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      //TODO: 에러처리 확장
      if (error) console.error(error);
      else setProject(data);
    };

    fetchProject();
  }, [id]);

  if (!project) return <div>ERROR: NO PROJECT FOUND!</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{project.title}</h1>

      {isLoggedIn ? (
        <button
          className={styles.editButton}
          onClick={() => navigate(`/projects/edit/${project.id}`)}
        >
          수정하기
        </button>
      ) : (
        ""
      )}

      {project.cover_image_url && (
        <img
          className={styles.coverImage}
          src={project.cover_image_url}
          alt={project.title}
        />
      )}

      <p className={styles.meta}>
        {project.category}, {project.status}
      </p>

      <p className={styles.date}>
        {project.start_date} ~ {project.end_date ?? "Present"}
      </p>

      {project.project_url && (
        <a
          className={styles.link}
          href={project.project_url}
          target="_blank"
          rel="noreferrer"
        >
          Visit Project
        </a>
      )}

      {/* .md  */}
      <article className={styles.markdown}>
        <ReactMarkdown>{project.content}</ReactMarkdown>
      </article>
    </div>
  );
};

export default ProjectDetail;
