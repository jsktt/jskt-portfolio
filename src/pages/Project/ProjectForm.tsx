import { useForm } from "react-hook-form";
import { supabaseClient } from "../../api/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import styles from "./ProjectForm.module.css";

type ProjectForm = {
  title: string;
  content: string;
  status: "NOT_DEPLOYED" | "DEPLOYED";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue, getValues } =
    useForm<ProjectForm>({
      defaultValues: {
        title: "",
        content: "",
      },
    });

  const content = watch("content", "");

  // loads project data when editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchProject = async () => {
      const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else reset(data);
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

  // uploads image to storage and inserts markdown into content
  const uploadImage = async (file: File) => {
    const safeName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${safeName}`;

    const { error } = await supabaseClient.storage
      .from("project-image")
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data } = supabaseClient.storage
      .from("project-image")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";
    setUploadError(null);
    setUploading(true);

    try {
      const url = await uploadImage(file);
      const current = getValues("content") || "";
      setValue("content", `${current}\n<img src="${url}" width="600" />\n`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1 className={styles.heading}>{isEdit ? "수정하기" : "생성하기"}</h1>

          <input
            className={styles.title}
            placeholder="제목"
            {...register("title", { required: true })}
          />

          <div className={styles.row}>
            <select
              className={styles.select}
              {...register("status", { required: true })}
            >
              <option value="NOT_DEPLOYED">Not Deployed</option>
              <option value="DEPLOYED">Deployed</option>
            </select>

            <select
              className={styles.select}
              {...register("category", { required: true })}
            >
              <option value="PERSONAL">Personal</option>
              <option value="TEAM">Team</option>
            </select>
          </div>

          <div className={styles.row}>
            <input
              className={styles.input}
              type="date"
              {...register("start_date", { required: true })}
            />
            <input
              className={styles.input}
              type="date"
              {...register("end_date")}
            />
          </div>

          <input
            className={styles.input}
            placeholder="Project URL"
            {...register("project_url")}
          />

          <input
            className={styles.input}
            placeholder="Additional URL"
            {...register("additional_url")}
          />

          <input
            className={styles.input}
            placeholder="Cover Image URL"
            {...register("cover_image_url")}
          />

          {/* image upload inserts into markdown content */}
          <button
            type="button"
            className={styles.imageButton}
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "업로드 중..." : "이미지"}
          </button>

          {uploadError && (
            <p className={styles.uploadError}>{uploadError}</p>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          <textarea
            className={styles.textarea}
            placeholder="markdown 으로 작성 하세요..."
            {...register("content", { required: true })}
          />

          <button type="submit" className={styles.submitButton}>
            {isEdit ? "수정하기" : "생성하기"}
          </button>
        </form>
      </div>

      <div className={styles.right}>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
      </div>

    </div>
  );
};

export default ProjectForm;
