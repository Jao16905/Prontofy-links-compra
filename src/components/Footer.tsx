const Footer = () => {
  return (
    <footer className="w-full py-10">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          © Copyright 2026 Prontofy &nbsp;| &nbsp;Todos os direitos reservados
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xl font-bold tracking-wide" style={{ color: "white" }}>
            REAX
          </span>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>|</span>
          <span className="text-xs font-light uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.6)" }}>
            Corps
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
