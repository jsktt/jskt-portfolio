import React, { useState } from "react";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * 로그인 구현, 유저 없으면 없다고 에러 메세지 날리기
   */

  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const user = await authApi.login(data.email, data.password);

      console.log("logged in: ", user);

      reset();
      navigate("/");
    } catch {
      setError("유저가 없거나 비밀번호가 일치하지 않습니다");
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          email:
          <input
            placeholder="이메일"
            type="text" {...register("email", { required: true })}/>
        </label>
        <label>
          password:
          <input
            placeholder="비밀번호"
            type="password" {...register("password", { required: true })}/>
        </label>
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
