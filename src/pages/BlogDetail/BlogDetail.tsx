import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";
import MarkdownRenderer from "../../components/MarkdownRenderer/MarkdownRenderer";
import styles from "./BlogDetail.module.css";
import LoginAuth from "../../provider/LoginAuth";
import type { BlogPost } from "../../types/Blog";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = LoginAuth();

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();

      if (error) console.error(error);
      else setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>ERROR: NO POST AVAILABLE</div>;

  return (
    <div>
      <h1>{post.title}</h1>

      <span>{post.created_at}</span>
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
        <MarkdownRenderer>{post.content ?? ""}</MarkdownRenderer>
      </article>
    </div>
  );
};

export default BlogDetail;
