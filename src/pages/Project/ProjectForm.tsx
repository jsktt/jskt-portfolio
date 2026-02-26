import { useForm } from "react-hook-form";
import { supabaseClient } from "../../api/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";


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
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch } = useForm<ProjectForm>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const content = watch("content", "");

  // loads project if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchProject = async () => {
      const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else reset(data); // populates the form
    };

    fetchProject();
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ProjectForm) => {
    if (isEdit) {
      await supabaseClient.from("projects").update(data).eq("id", Number(id));
    } else {
      await supabaseClient.from("projects").insert([data]);
    }

    navigate("/projects");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>{isEdit ? "수정하기" : "생성하기"} </h1>
      <input placeholder="제목" {...register("title", { required: true })} />

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

      <div>
        <textarea
        placeholder="markdown 으로 작성 하세요..."
        {...register("content", { required: true })}
        />

        <div>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>

      </div>

      <button type="submit">{isEdit ? "수정하기" : "생성하기"}</button>
    </form>
  );
};

export default ProjectForm;
