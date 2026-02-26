import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabaseClient } from "../../api/supabase";

type Blog = {
  id: number;
  title: string;
};

const Blog = () => {
  const [post, setPost] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabaseClient
      .from("posts")
      .select("id, title")
      .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setPost(data ?? []);   // only falls back for null and undefined. 
    };

    fetchPost();
  }, [])


  return (
    <div>
      <Link to="/writings/new"> 블로그 글 쓰기</Link>

      <hr />

      {post.map((post) => (
        <p key={post.id}>
          <Link to={`/writings/${post.id}`}>{post.title}</Link>
        </p>
      ))}
    </div>
  );
};

export default Blog;
