import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabaseClient } from "../../api/supabase";
import styles from "./Blog.module.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import LoginAuth from "../../provider/LoginAuth";
import { useNavigate } from "react-router-dom";

type Blog = {
  id: number;
  title: string;
  content?: string;
  created_at?: string;
};

const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "");

type Heading = { text: string; id: string };

/** Parse ## headings from raw markdown */
const parseHeadings = (markdown: string): Heading[] => {
  const matches = markdown.match(/^## (.+)$/gm);
  if (!matches) return [];
  return matches.map((m) => {
    const text = m.replace(/^## /, "");
    return { text, id: toSlug(text) };
  });
};

/** Custom h2 renderer that injects an id for scroll targeting */
const HeadingWithId = ({ children, ...props }: React.ComponentProps<"h2">) => {
  const id = toSlug(String(children));
  return <h2 id={id} {...props}>{children}</h2>;
};

/** Track which h2 is currently in the viewport */
const useActiveHeading = (articleRef: React.RefObject<HTMLDivElement | null>, headings: Heading[]) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!articleRef.current || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // find the first heading entering the viewport
        const entering = entries.find((e) => e.isIntersecting);
        if (entering) {
          setActiveId(entering.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    const h2Elements = articleRef.current.querySelectorAll("h2[id]");
    h2Elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [articleRef, headings]);

  return activeId;
};

/** Fixed sidebar table of contents, rendered via portal */
const TableOfContents = ({
  headings,
  activeId,
}: {
  headings: Heading[];
  activeId: string | null;
}) => {
  if (headings.length === 0) return null;

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return createPortal(
    <nav className={styles.toc}>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`${styles.tocItem} ${activeId === h.id ? styles.tocItemActive : ""}`}
          onClick={(e) => handleClick(e, h.id)}
        >
          {h.text}
        </a>
      ))}
    </nav>,
    document.body
  );
};

/** Expanded article view with TOC sidebar */
const ExpandedContent = ({
  post,
  isLoggedIn,
  onEdit,
}: {
  post: Blog;
  isLoggedIn: boolean;
  onEdit: () => void;
}) => {
  const articleRef = useRef<HTMLDivElement>(null);
  const headings = useMemo(() => parseHeadings(post.content ?? ""), [post.content]);
  const activeId = useActiveHeading(articleRef, headings);

  return (
    <>
      <TableOfContents headings={headings} activeId={activeId} />
      <div className={styles.contentBody}>
        <span className={styles.date}>
          {new Date(post.created_at ?? "").toLocaleDateString()}
        </span>
        <p>
          {isLoggedIn ? (
            <button className={styles.editButton} onClick={onEdit}>
              EDIT
            </button>
          ) : (
            ""
          )}
        </p>
        <article ref={articleRef} className={styles.markdown}>
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
            components={{ h2: HeadingWithId }}
          >
            {post.content ?? ""}
          </ReactMarkdown>
        </article>
      </div>
    </>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [expandedPost, setExpandedPost] = useState<Blog | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const isLoggedIn = LoginAuth();
  const navigate = useNavigate();

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
    setActiveId(post.id); // trigger slide up animation.

    // fetch full content
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

              {/* This only renders once the post is "expanded" */}
              {isActive && expandedPost && (
                <ExpandedContent
                  post={expandedPost}
                  isLoggedIn={isLoggedIn}
                  onEdit={() => navigate(`/writings/edit/${post.id}`)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Blog;
