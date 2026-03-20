import { motion } from "framer-motion";

const features = [
  {
    title: "Standardized Schema",
    description: "A well-defined data format based on GTFS, adapted for historical accuracy — supporting estimated schedules, seasonal routes, and archival sources.",
  },
  {
    title: "Temporal Coverage",
    description: "Five centuries of transit data, from 15th-century postal carriages to the dense railway networks of the late 1800s.",
  },
  {
    title: "Interoperable",
    description: "Compatible with modern GIS tools and GTFS viewers. Export to GeoJSON, CSV, or use directly with mapping libraries.",
  },
  {
    title: "Open & Collaborative",
    description: "Fully open-source. Contribute datasets, improve the specification, or build visualization tools on top of HGTFS.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Why HGTFS?
          </h2>
          <div className="h-px w-16 bg-primary" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary font-display font-bold text-sm">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed text-sm">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
