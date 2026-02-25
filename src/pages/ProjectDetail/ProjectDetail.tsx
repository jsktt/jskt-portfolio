import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setProject(data);
    };

    fetchProject();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h1>{project.title}</h1>

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
