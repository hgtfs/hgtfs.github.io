const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display font-bold text-foreground">HGTFS</div>
        <p className="text-sm font-body text-muted-foreground">
          Made with ❤️ in Bologna by{" "}
          <a
            href="https://www.openhistorymap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            OpenHistoryMap
          </a>
        </p>
        <div className="flex items-center gap-5">
          <a href="/viewer/" className="text-sm font-body text-primary hover:underline">
            Viewer
          </a>
          <a
            href="https://github.com/hgtfs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-body text-primary hover:underline"
          >
            GitHub →
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
