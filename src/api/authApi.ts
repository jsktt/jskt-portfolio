/**
 * 
 * authApi: 사인업 / 로그인 / 로그아웃 로직 구현
 */

import { supabaseClient } from "./supabase"

export const authApi = {

    // FUTURE TODO: 사인업 로직 구현하기


    // login users registered through supabase auth, <return user> 
    login: async(email: string, password: string) => {
        const { data, error }= await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw alert(error.message);

        return data.user;       
    },

    signout: () => {
        supabaseClient.auth.signOut();
    },
};