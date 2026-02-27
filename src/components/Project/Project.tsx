import { useEffect, useState } from "react";
import { supabaseClient } from "../../api/supabase";
import ProjectSection from "../ProjectSection/ProjectSection";

type ProjectData = {
  id: number;
  title: string;
  category: string;
  description: string;
};

const Project = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) setProjects(data);
    };

    fetchProject();
  }, []);

  return (
    <>
      {projects.map((project) => (
        <ProjectSection key={project.id} project={project} />
      ))}
    </>
  );
};

export default Project;
