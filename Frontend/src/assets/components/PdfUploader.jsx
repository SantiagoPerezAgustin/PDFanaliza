import { useState } from "react";

export default function PdfUploader() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!selectedFile) {
        alert("Por favor, seleccioná un archivo PDF.");
        return;
      }

      setLoading(true);

      setTimeout(() => {
        console.log("PDF seleccionado:", file);
        setLoading(false);
        alert("PDF listo para enviar al backend");
      }, 1000);
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Analizar PDF"}
        </button>
      </form>
    );
}