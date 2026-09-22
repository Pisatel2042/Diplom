using Newtonsoft.Json;

namespace WebApplication1.Services;

public class RecaptchaService
{
    private readonly string _secretKey;
    private readonly HttpClient _http;

    public RecaptchaService(IConfiguration config)
    {
        _secretKey = config["Recaptcha:SecretKey"];
        _http = new HttpClient();
    }

    public async Task<bool> ValidateAsync(string token)
    {
        var response = await _http.PostAsync(
            $"https://www.google.com/recaptcha/api/siteverify?secret={_secretKey}&response={token}",
            null
        );

        var json = await response.Content.ReadAsStringAsync();
        dynamic result = JsonConvert.DeserializeObject(json);

        return result.success == true;
    }

}