import { useQuery } from "@tanstack/react-query";
import type { User } from "../../types/User";
import { supabaseClient } from "../../api/supabase";

const About = () => {
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabaseClient.from("users").select("*");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>error occured!!</p>;
  return (
    <>
      {users.map((user) => (
        <div key={user.email}>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </>
  );
};

export default About;
