import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";
import styles from "./BlogForm.module.css";

type BlogForm = {
  title: string;
  content: string;
  created_at: string;
};

const BlogForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, reset, setValue, getValues } =
    useForm<BlogForm>();

  // loads post data when editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchPost = async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else reset(data);
    };

    fetchPost();
  }, [id, isEdit, reset]);

  const content = watch("content", "");

  const onSubmit = async (data: BlogForm) => {
    if (isEdit) {
      await supabaseClient.from("posts").update(data).eq("id", Number(id));
    } else {
      await supabaseClient.from("posts").insert([data]);
    }

    navigate("/writings");
  };

  // uploads image to storage and inserts markdown into content
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabaseClient.storage
      .from("blog-image")
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data } = supabaseClient.storage
      .from("blog-image")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    const current = getValues("content") || "";
    setValue("content", `${current}\n![image](${url})\n`);
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

          {/* image upload inserts into markdown content */}
          <button
            type="button"
            className={styles.imageButton}
            onClick={() => fileInputRef.current?.click()}
          >
            이미지
          </button>

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
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

    </div>
  );
};

export default BlogForm;
