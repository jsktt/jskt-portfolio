import { useSelector } from "react-redux"
import type { RootState } from "../store/store"



const LoginAuth = () => {
    const user = useSelector((state: RootState) => state.auth.email);

    return Boolean(user);
}

export default LoginAuth;