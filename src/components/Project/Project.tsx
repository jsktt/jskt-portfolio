import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";

type Project = {
  id: number;
  title: string;
};

const Project = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabaseClient
        .from("projects")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setProjects(data ?? []);
    };

    fetchProject();
  }, []);

  return (
    <div>
      <h1>프로젝트 공간</h1>
      <Link to="/create_project">프로젝트 생성하기</Link>

      <hr />

      {projects.map((project) => (
        <p key={project.id}>
          <Link to={`/projects/${project.id}`}>{project.title}</Link>
        </p>
      ))}
    </div>
  );
};

export default Project;
