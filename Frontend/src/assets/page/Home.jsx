import PdfUploader from "../components/PdfUploader";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 mb-6 text-sm text-indigo-100">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        IA disponible
      </span>

      <h1 className="text-4xl sm:text-5xl font-bold text-center text-white mb-3 tracking-tight">
        Analizador de PDFs
        <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          con Inteligencia Artificial
        </span>
      </h1>

      <p className="text-slate-300 mb-10 text-center max-w-md text-lg leading-relaxed">
        Subí un archivo PDF y extraé información relevante al instante.
      </p>

      <PdfUploader />

      <p className="mt-8 text-slate-400 text-sm">
        Solo archivos .pdf • Máx. 10 MB
      </p>
    </div>
  );
}
