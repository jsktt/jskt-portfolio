import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import styles from "./BlogDetail.module.css";
import LoginAuth from "../../provider/LoginAuth";

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
  const isLoggedIn = LoginAuth();

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

  if (!post) return <div> ERROR: NO POST AVALIABLE</div>;

  return (
    <div>
      <h1>{post.title}</h1>

      <span>{post.created_date}</span>
      {isLoggedIn ? (
        <button
          className={styles.editBtn}
          onClick={() => navigate(`/writings/edit/${post.id}`)}
        >
          EDIT
        </button>
      ) : (
        ""
      )}
      <article>
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}>{post.content}</ReactMarkdown>
      </article>
    </div>
  );
};

export default BlogDetail;
