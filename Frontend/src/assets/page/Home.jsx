import PdfUploader from "../components/PdfUploader";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-3xl font-bold mb-2">Analizador de PDFs con IA 🤖</h1>

      <p className="text-gray-600 mb-6 text-center max-w-md">
        Subí un archivo PDF y extraé información relevante usando inteligencia
        artificial.
      </p>

        <PdfUploader />
    </div>
  );
}