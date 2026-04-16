using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using KuduWallet.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
namespace KuduWallet.Controllers
{
    [ApiController]
    [Route("api/auth")]

    public class AuthController: ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;

        public AuthController(AppDbContext context, IConfiguration config, IHttpClientFactory httpClient)
        {
            _context=context;
            _config=config;
            _httpClient=httpClient.CreateClient();
        }

        //Post request from frontend post /api/auth/google

        [HttpPost("google")]
        public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request)
        {
            Console.WriteLine("Triggeted backend");
            var tokenResponse = await ExchangeCodeForTokens(request.code);
            //For testing pursposes
            if (tokenResponse==null)
            {
                return Unauthorized("Failed to get data from Google");
            }

            var googleUser =await GetGoogleUserInfo(tokenResponse.AccessToken);
            //For testing pursposes can remove later
            if(googleUser==null)
            {return Unauthorized("Failed to get user Info");}

            //Find or creating user
            var user = await _context.users.FirstOrDefaultAsync(u=> u.GoogleID == googleUser.Id);
            //check if there is no user
            if(user==null)
            {
                user = new Users
                {
                    GoogleID= googleUser.Id,
                    Email= googleUser.Email,
                    Name = googleUser.Name,
                    Role = "Student"
                };
                _context.users.Add(user);
                await _context.SaveChangesAsync();
            }


             var accessToken = GenerateJwt(user);
             var refreshToken = GenerateRefreshToken();

             //Saving to Database

             _context.RefreshTokens.Add(new RefreshToken
             {
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                UserID = user.Id
            });

            await _context.SaveChangesAsync();

            Response.Cookies.Append("refreshToken",refreshToken,new CookieOptions
            {
                HttpOnly = true,
                Secure =true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });



            return Ok(new { accessToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if(string.IsNullOrEmpty(refreshToken) == false)
            {
                var stored = await _context.RefreshTokens
                .FirstOrDefaultAsync(r => r.Token ==refreshToken);

                if(stored != null)
                {
                    stored.isRevoked=true;
                    await _context.SaveChangesAsync();
                }
            }

            Response.Cookies.Delete("refreshToken");
            return Ok(new {Message = "Logged Out"});
        }

        //Helper functions: still to understand
        private async Task<GoogleTokenResponse?> ExchangeCodeForTokens(string code)
        {
            var payload = new Dictionary<string,string>
            {
                { "code", code },
                { "client_id", _config["Google:ClientId"] },
                { "client_secret", _config["Google:ClientSecret"] },
                { "redirect_uri", _config["Google:RedirectUri"] },
                { "grant_type", "authorization_code" }
            };

            var response = await _httpClient.PostAsync(
                "https://oauth2.googleapis.com/token",
                new FormUrlEncodedContent(payload)
            );

            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<GoogleTokenResponse>(json);

            
        }

            private async Task<GoogleUserInfo?> GetGoogleUserInfo(string accessToken)
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<GoogleUserInfo>(json);
        }


               private string GenerateJwt(Users user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }


        ///DTos, you should remove them to a different folder
        /// 
        public class GoogleAuthRequest
        {
            public string code {get;set;}
        }
        public class GoogleTokenResponse
    {
        [System.Text.Json.Serialization.JsonPropertyName("access_token")]
        public string AccessToken { get; set; }
    }

     public class GoogleUserInfo
    {
        [System.Text.Json.Serialization.JsonPropertyName("id")]
        public string Id { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("email")]
        public string Email { get; set; }
        [System.Text.Json.Serialization.JsonPropertyName("name")]
        public string Name { get; set; }
   
    }
    }
}