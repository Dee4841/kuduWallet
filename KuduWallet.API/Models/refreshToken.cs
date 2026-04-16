using Microsoft.AspNetCore.Mvc;

namespace KuduWallet.Data
{
    
    public class RefreshToken
    {
        public int Id {get;set;}
        public string Token {get;set;}

        public DateTime ExpiresAt {get;set;}
        public DateTime CreatedAt {get;set;} = DateTime.UtcNow;

        public bool isRevoked {get;set;} = false;
        public int UserID {get;set;}
        public Users User {get;set;}
    }

}