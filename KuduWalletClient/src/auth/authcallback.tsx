import { useEffect } from "react";
import axios from "axios";

function AuthCallback ()
{
    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
            axios.post("http://localhost:5070/api/auth/google", { code })
                .then(res => {
                    const { accessToken } = res.data;
                    localStorage.setItem("accessToken", accessToken);
                   
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