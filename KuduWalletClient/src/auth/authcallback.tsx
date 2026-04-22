import { useEffect } from "react";
import axios from "axios";

function AuthCallback ()
{
    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
            axios.post("http://localhost:5070/api/auth/google", { code })
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