import { useState, useRef } from "react";

export default function PdfUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5076";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("File", file); // backend espera propiedad "File"

    try {
      const res = await fetch(`${API_URL}/api/pdf/analyze`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data.message || data.title || res.statusText || "Error al analizar",
        );
        return;
      }
      setResult({
        fileName: data.fileName,
        characters: data.characters,
        aiSummary: data.aiSummary,
      });
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
          bg-white/5 backdrop-blur-sm
          ${isDragging ? "border-indigo-400 bg-indigo-500/20 scale-[1.02]" : "border-white/20 hover:border-white/40 hover:bg-white/10"}
          ${file ? "py-6" : "py-12"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {!file ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 text-center pointer-events-none">
            <div className="rounded-2xl bg-white/10 p-4">
              <svg
                className="w-12 h-12 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-white font-medium">
              Arrastrá un PDF acá o hacé clic para elegir
            </p>
            <p className="text-slate-200 text-sm">Solo archivos .pdf</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-6">
            <div className="rounded-xl bg-emerald-500/20 p-2 shrink-0">
              <svg
                className="w-8 h-8 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white font-medium truncate">{file.name}</p>
              <p className="text-slate-300 text-sm">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="shrink-0 rounded-full p-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Quitar archivo"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!file || loading}
        className="mt-6 w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25 disabled:shadow-none"
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analizando...
          </span>
        ) : (
          "Analizar PDF"
        )}
      </button>
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {error}
        </div>
      )}
      {result && (
        <div className="mt-6 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-left">
          <p className="text-indigo-200 font-medium mb-1">{result.fileName}</p>
          <p className="text-slate-400 text-sm mb-3">
            {result.characters} caracteres
          </p>
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
            {result.aiSummary}
          </p>
        </div>
      )}
    </form>
  );
}
