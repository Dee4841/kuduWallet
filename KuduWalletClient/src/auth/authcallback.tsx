import { useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
function AuthCallback ()
{
    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
            axios.post(`${API_URL}/api/auth/google`, { code })
                .then(res => {
                    const { accessToken, userName, userEmail } = res.data;
                    
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("userEmail", userEmail);
                    localStorage.setItem("userName", userName);

                   window.location.href = "/landingPage";
                })
                .catch(err => console.error("Auth failed:", err));
        }
    }, []);
    return(
        <>
        </>
    )
}

export default AuthCallback;