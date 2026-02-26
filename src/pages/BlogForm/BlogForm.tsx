import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef } from "react";

type BlogForm = {
  title: string;
  content: string;
  created_at: string;
};

const BlogForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  // setValues -> modify md content
  const { register, handleSubmit, watch, reset, setValue, getValues } =
    useForm<BlogForm>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  // loads project if editing
  useEffect(() => {
    if (!isEdit) return;

    const fetchPost = async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else reset(data); // populate form
    };

    fetchPost();
  }, [id, isEdit, reset]);

  // preview rendered .md content
  const content = watch("content", "");

  const onSubmit = async (data: BlogForm) => {
    if (isEdit) {
      await supabaseClient.from("posts").update(data).eq("id", Number(id));
    } else {
      await supabaseClient.from("posts").insert([data]);
    }

    navigate("/writings");
  };

  /**
   * file format 
   * {  name: "...",
   *    size: 21234,
   *    type: "image/png"
   *    lastmodified:...}
   */

  // HELPER FUNCTION FOR IMG UPLOAD
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabaseClient.storage
      .from("blog-image") // bucket name
      .upload(fileName, file, { upsert: true });  // upsert -> override

      if (error) throw error;

    const { data } = supabaseClient.storage
      .from("blog-image")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };


  // image md
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // file object can only select a single file. 
    if (!file) return;

    const url = await uploadImage(file);

    // return content if true, else ""
    const current = getValues("content") || "";

    setValue("content", `${current}\n![image](${url})\n`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="제목" {...register("title", { required: true })} />
      <h1>{isEdit ? "수정하기" : "생성하기"}</h1>

      {/* file picker */}
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        이미지
      </button>

      <input
        type="file"   // emits change event
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {/** Editor + Preview */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/** .md editor */}
        <textarea
          placeholder="mardown 으로 작성 하세요..."
          {...register("content", { required: true })}
        />
        {/** live preview */}
        <div>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      <button type="submit"> {isEdit ? "수정하기" : "생성하기"} </button>
    </form>
  );
};

export default BlogForm;
