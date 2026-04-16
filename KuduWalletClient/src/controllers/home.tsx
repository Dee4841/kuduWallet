import {jwtDecode} from "jwt-decode"; // Will use this to get persona information

const Google_Client_ID = import.meta.env.VITE_Google_Client_ID;
const Redirect_URL= "http://localhost:5173/auth/callback";
function home()
{

    const handleLoginWithGoogle = () => {

        const params = new URLSearchParams(
            {
                client_id: Google_Client_ID,
                redirect_uri : Redirect_URL,
                response_type :"code",
                scope:"openid email profile",
                access_type: "offline",
                prompt: "select_account",
            }
        );

         window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    }
        

 

return(

    <main>

        <section>
            <h2>Welcome to KuduWallet</h2>
        </section>

        <section>
           <button onClick={()=> handleLoginWithGoogle()}>
            SignInWithGoogle
           </button>
            
        </section>
    </main>
);
}

export default home;