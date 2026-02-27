import { useEffect, useState } from "react";
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
      }, 100); // wait till the header to shrink
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
        {posts.map((post, index) => {
          const isActive = activeId === post.id;
          const isHidden = activeId !== null && !isActive;

          return (
            <div
              key={post.id}
              className={`
                ${styles.article} 
                ${isActive ? styles.isActive : ""} 
                ${isHidden ? styles.isHidden : ""}
              `}
              style={{ zIndex: index + 1 }} // z-index 위치에서 제일 높게 설정
              onClick={() => !activeId && handleExpand(post)}
            >
              <div className={styles.headerWrapper}>
                <span className={styles.title}>{post.title}</span>
                {isActive && (
                  <button className={styles.backArrow} onClick={handleClose}>
                    BACK
                  </button>
                )}
              </div>

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
