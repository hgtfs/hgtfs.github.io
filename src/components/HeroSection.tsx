import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroMap from "@/assets/hero-map.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroMap}
          alt="Historical transit map"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      <div className="container relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-body tracking-widest uppercase text-muted-foreground">
              Historical General Transit Feed Specification
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            HGTFS
          </h1>

          <p className="text-xl md:text-2xl font-body font-light text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            A standardized format for historical transit data — mapping rail, carriage,
            and bus networks from the 15th to 19th century for research and visualization.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-medium rounded-sm hover:bg-primary/90 transition-colors"
            >
              View on GitHub
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <Link
              to="/reference"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-body font-medium rounded-sm hover:bg-muted transition-colors"
            >
              Reference
            </Link>
          </div>
        </motion.div>

        {/* Timeline hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 flex items-center gap-6 text-sm text-muted-foreground font-body"
        >
          <span className="font-display text-lg text-primary">1400</span>
          <div className="flex-1 h-px bg-border max-w-xs relative">
            <div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full bg-gold -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary -translate-y-1/2" />
            <div className="absolute top-1/2 left-3/4 w-2 h-2 rounded-full bg-forest -translate-y-1/2" />
          </div>
          <span className="font-display text-lg text-primary">1900</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
