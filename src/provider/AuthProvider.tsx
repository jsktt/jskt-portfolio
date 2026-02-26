import { useEffect, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { supabaseClient } from "../api/supabase";
import { setSession } from "../store/authSlice";




interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session?.user?.email ?? null));
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_, session) => {
      dispatch(setSession(session?.user?.email ?? null));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};
