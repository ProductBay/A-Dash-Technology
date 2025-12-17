import { motion } from "framer-motion";

export default function Vision() {
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      {/* Section separation fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Built in Jamaica.
            <span className="block text-white/80">
              Designed for the world.
            </span>
          </h2>

          {/* Divider for hierarchy */}
          <div className="mt-6 h-px w-24 bg-glow/40" />

          <p className="mt-8 text-white/70 text-lg leading-relaxed max-w-3xl">
            A’Dash Technology is among the first local companies delivering
            full-stack platforms, AI-assisted systems, and modern developer-grade
            software — without exporting innovation overseas.
          </p>

          <p className="mt-4 text-white/60 max-w-2xl">
            We don’t chase trends. We architect what comes next.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
