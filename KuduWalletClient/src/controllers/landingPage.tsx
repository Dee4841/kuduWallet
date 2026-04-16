import axios from "axios";

function landPage()
{
    const  handleLogOut =async () =>
    {
        try
        {
            await axios.post("http://localhost:5070/api/auth/logout", {},{
                withCredentials:true
        });
        localStorage.removeItem("accessToken");
        window.location.href = "/"
        }
        catch(error)
        {
            console.error("Failed to logOut");
        }
    }
    return(

        <main>
            <section>

                <h2>Welcome to our landing page</h2>
               
            </section>
          
            <section>
                 <button onClick={()=> handleLogOut()}>logOut</button>
            </section>

        </main>
    );
}

export default landPage;