export default function Footer() {
  return (
    <footer className="bg-brand-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-8 border-b border-brand-900">
          {/* Left */}
          <div className="space-y-2">
            <div className="flex flex-col leading-none mb-3">
              <span className="text-brand-400 text-xs font-semibold tracking-widest uppercase">Globe</span>
              <span className="text-white text-xl font-bold tracking-tight">LIFT PARTS</span>
              <span className="text-gray-500 text-xs">by Grupo Globe</span>
            </div>
            <p className="text-sm text-gray-400">
              Isidora Goyenechea 3520, Of. 300
            </p>
            <p className="text-sm text-gray-400">Las Condes, Santiago, Chile</p>
          </div>

          {/* Right */}
          <div className="space-y-2 sm:text-right">
            <p className="text-white font-semibold text-sm">Contacto</p>
            <a
              href="mailto:contacto@grupoglobe.com"
              className="text-brand-400 text-sm hover:text-brand-300 transition-colors"
            >
              contacto@grupoglobe.com
            </a>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs pt-6">
          © 2026 Grupo Globe — Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}
