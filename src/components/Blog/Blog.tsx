import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";
import styles from "./Blog.module.css";
import ReactMarkdown from "react-markdown";

type Blog = {
  id: number;
  title: string;
  content?: string;
  created_at?: string;
};

const Blog = () => {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [expandedPost, setExpandedPost] = useState<Blog | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabaseClient
        .from("posts")
        .select("id, title")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setPosts(data ?? []); // only falls back for null and undefined.
    };

    fetchPost();
  }, []);

  const handleExpand = async (post: Blog) => {
    setActiveId(post.id); // triger slide up animation.

    //TODO: spacer hidden 처리

    //fetch full content
    const { data } = await supabaseClient
      .from("posts")
      .select("*")
      .eq("id", post.id)
      .maybeSingle();

    // if (data) setExpandedPost(data);

    if (data) {
      setTimeout(() => {
        setExpandedPost(data);
        window.scrollTo(0, 0);
      }, 350); // wait till the header to shrink
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPost(null);
    setActiveId(null);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.spacer} ${activeId ? styles.spacerHidden : ""}`}
      />

      <div className={`${styles.list} ${activeId ? styles.listSearching : ""}`}>
        {posts.map((post) => {
          const isActive = activeId === post.id;
          const isHidden = activeId && activeId !== post.id;

          return (
            <div
              key={post.id}
              className={`
                ${styles.article} 
                ${isActive ? styles.isActive : ""} 
                ${isHidden ? styles.isHidden : ""}
              `}
              onClick={() => !activeId && handleExpand(post)}
            >
              <span className={styles.title}>{post.title}</span>

              {/* This only renders once the post is "Expanded" */}
              {isActive && expandedPost && (
                <div className={styles.contentBody}>
                  <span className={styles.date}>
                    {new Date(
                      expandedPost.created_at ?? "",
                    ).toLocaleDateString()}
                  </span>
                  <article className={styles.markdown}>
                    <ReactMarkdown>{expandedPost.content ?? ""}</ReactMarkdown>
                  </article>
                  <button className={styles.backButton} onClick={handleClose}>
                    CLOSE
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Blog;
