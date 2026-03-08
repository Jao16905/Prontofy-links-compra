const Footer = () => {
  return (
    <footer className="w-full py-8" style={{ background: 'linear-gradient(180deg, hsl(214,100%,15%) 0%, hsl(220,20%,7%) 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm text-primary-foreground/80">
          © Copyright 2026 Prontofy &nbsp;| &nbsp;Todos os direitos reservados
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-primary-foreground">
          <span className="text-xl font-bold tracking-wide">REAX</span>
          <span className="text-primary-foreground/40">|</span>
          <span className="text-xs font-light tracking-[0.25em] uppercase">Corps</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
