import { useForm } from "react-hook-form";
import { supabaseClient } from "../../api/supabase";
import { useNavigate } from "react-router-dom";

type ProjectForm = {
  title: string;
  content: string;
  status: "NOT DEPLOYED" | "DEPLOYED";
  category: "PERSONAL" | "TEAM";
  start_date: string;
  end_date?: string;
  project_url?: string;
  additional_url?: string;
  cover_image_url?: string;
};

const ProjectForm = () => {
  const { register, handleSubmit } = useForm<ProjectForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: ProjectForm) => {
    const { error } = await supabaseClient.from("projects").insert([data]);

    if (error) console.error(error);

    navigate("/projects");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="제목" {...register("title", { required: true })} />

      <textarea {...register("content", { required: true })} />

      {/** status enum */}
      <select {...register("status", { required: true })}>
        <option value="NOT DEPLOYED">Not deployed</option>
        <option value="DEPLOYED">Deployed</option>
      </select>

      {/** category enum */}
      <select {...register("category", { required: true })}>
        <option value="PERSONAL">Personal</option>
        <option value="TEAM">Team</option>
      </select>

      <input type="date" {...register("start_date", { required: true })} />
      <input type="date" {...register("end_date")} />

      <input {...register("project_url")} placeholder="Project URL" />

      <button type="submit">만들기</button>
    </form>
  ); 
};

export default ProjectForm;
