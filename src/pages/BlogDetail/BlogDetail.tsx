import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";
import ReactMarkdown from "react-markdown";
import styles from "./BlogDetail.module.css";

type Blog = {
  id: number;
  title: string;
  content: string; // .md file
  created_date: string; // fetch from supabase
};

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("id", Number(id)) // add WHERE column = value filter into query
        .maybeSingle();

      //TODO: 에러처리 확장
      if (error) console.error(error);
      else setPost(data);
    };

    fetchPost();
  }, [id]);

  if (!post) return <div> 글 좀 쓰자... 블로그 포스트가 없다...</div>;

  return (
    <div>
      <h1>{post.title}</h1>

      <span>{post.created_date}</span>
      <button
        className={styles.editBtn}
        onClick={() => navigate(`/writings/edit/${post.id}`)}
      >
        EDIT
      </button>
      <article>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
};

export default BlogDetail;
