using Microsoft.AspNetCore.Mvc;
using PdfAnalyzer.Api.Models;
using PdfAnalyzer.Api.Services;
using System.Text;
using UglyToad.PdfPig;

namespace PdfAnalyzer.Api.Controllers
{
    [ApiController]
    [Route("api/pdf")]
    public class PdfController : ControllerBase
    {
        private readonly GroqService _groqService;

        public PdfController(GroqService groqService)
        {
            _groqService = groqService;
        }

        [HttpPost("analyze")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Analyze([FromForm] PdfAnalyzeRequest request)
        {
            var file = request.File;

            if (file == null || file.Length == 0)
                return BadRequest("No se recibió ningún archivo");

            var textBuilder = new StringBuilder();

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0;

                using (var pdf = PdfDocument.Open(stream))
                {
                    foreach (var page in pdf.GetPages())
                    {
                        textBuilder.AppendLine(page.Text);
                    }
                }
            }

            var fullText = textBuilder.ToString();

            var summary = await _groqService.GetSummaryAsync(fullText);

            return Ok(new
            {
                fileName = file.FileName,
                characters = fullText.Length,
                aiSummary = summary
            });
        }
    }
}
