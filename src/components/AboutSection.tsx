import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
            What is HGTFS?
          </h2>
          <p className="text-lg font-body text-muted-foreground leading-relaxed">
            HGTFS (Historical General Transit Feed Specification) adapts the modern GTFS
            standard for historical transit systems. It provides a common data baseline
            for researchers, historians, and data scientists to analyze, compare, and
            visualize centuries of public transportation evolution.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "🚂",
              title: "Rail Networks",
              period: "1804 – 1900",
              description:
                "From the earliest tramways to the golden age of steam railways — track gauges, stations, timetables, and route networks.",
            },
            {
              icon: "🐴",
              title: "Carriage Routes",
              period: "1400 – 1850",
              description:
                "Stagecoach lines, postal routes, and horse-drawn omnibus services that connected cities before the age of steam.",
            },
            {
              icon: "🚌",
              title: "Early Bus Services",
              period: "1820 – 1900",
              description:
                "Horse-bus and early motorbus routes that formed the backbone of urban transit in the 19th century.",
            },
          ].map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="p-8 border border-border rounded-sm bg-background hover:shadow-lg transition-shadow"
            >
              <span className="text-4xl mb-4 block">{mode.icon}</span>
              <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                {mode.title}
              </h3>
              <span className="text-sm font-body text-primary font-medium mb-4 block">
                {mode.period}
              </span>
              <p className="font-body text-muted-foreground leading-relaxed text-sm">
                {mode.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
