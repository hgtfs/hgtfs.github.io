const FooterSection = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display font-bold text-foreground">HGTFS</div>
        <p className="text-sm font-body text-muted-foreground">
          Historical General Transit Feed Specification — Open source, open data.
        </p>
        <a
          href="https://github.com/hgtfs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-body text-primary hover:underline"
        >
          GitHub →
        </a>
      </div>
    </footer>
  );
};

export default FooterSection;
