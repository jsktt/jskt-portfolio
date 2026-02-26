import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";
import ReactMarkdown from "react-markdown";

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

  if (!project) return <div>분발하자... 프로젝트가 없다....</div>;

  return (
    <div>
      <h1>{project.title}</h1>

      <button onClick={() => navigate(`/projects/edit/${project.id}`)}>
        수정하기
      </button>

      {project.cover_image_url && (
        <img src={project.cover_image_url} alt={project.title} />
      )}

      <p>
        {project.category} * {project.status}
      </p>

      <p>
        {project.start_date} ~ {project.end_date ?? "Present"}
      </p>

      {project.project_url && (
        <a href={project.project_url} target="_blank">
          Visit Project
        </a>
      )}

      {/* .md  */}
      <ReactMarkdown>{project.content}</ReactMarkdown>
    </div>
  );
};

export default ProjectDetail;
