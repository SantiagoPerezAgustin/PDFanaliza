using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PdfAnalyzer.Api.Services
{
    public class GroqService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public GroqService(IConfiguration configuration)
        {
            _apiKey = configuration["Groq:ApiKey"] ?? "";
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("https://api.groq.com/openai/v1/");
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<string> GetSummaryAsync(string text)
        {
            var requestBody = new
            {
                model = "llama-3.1-8b-instant",
                messages = new[]
                {
                    new { role = "user", content = $"Resumí el siguiente CV en 5 líneas claras:\n{text}" }
                }
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("chat/completions", content);
            var responseText = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception(responseText);

            using var doc = JsonDocument.Parse(responseText);
            return doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "";
        }
    }
}