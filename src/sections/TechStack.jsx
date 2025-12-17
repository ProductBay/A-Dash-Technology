import "../styles/tech-stack.css";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiPhp,
  SiReact,
  SiVite,
  SiFramer,
  SiThreedotjs,
  SiSupabase,
  SiPostgresql,
  SiFirebase,
  SiVercel,
  SiGithub,
  SiOpenai,
  SiWhatsapp,
} from "react-icons/si";

const stack = [
  {
    title: "Languages & Runtimes",
    items: [
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
      { name: "Python", icon: SiPython },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "PHP", icon: SiPhp },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", icon: SiReact },
      { name: "Vite", icon: SiVite },
      { name: "Framer Motion", icon: SiFramer },
      { name: "Three.js", icon: SiThreedotjs },
    ],
  },
  {
    title: "Backend & Databases",
    items: [
      { name: "Supabase", icon: SiSupabase },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "Firebase", icon: SiFirebase },
    ],
  },
  {
    title: "Cloud & DevOps",
    items: [
      { name: "Vercel", icon: SiVercel },
      { name: "GitHub", icon: SiGithub },
    ],
  },
  {
    title: "AI & Automation",
    items: [
      { name: "OpenAI", icon: SiOpenai },
      { name: "AI Builders" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { name: "WhatsApp APIs", icon: SiWhatsapp },
      { name: "Webhooks" },
      { name: "Payment Gateways" },
    ],
  },
];

export default function TechStack() {
  return (
    <section className="tech-stack">
      <div className="tech-header">
        <span className="tech-eyebrow">CAPABILITIES</span>
        <h2>Technology we build with</h2>
        <p>
          We operate across the modern software stack — from interface to
          infrastructure.
        </p>
      </div>

      <div className="tech-rails">
        {stack.map((group, index) => (
  <div
    className="tech-group"
    key={group.title}
    style={{
      "--duration": `${40 + index * 10}s`,
      "--direction": index % 2 === 0 ? "normal" : "reverse",
    }}
  >
    <h3>{group.title}</h3>

    <div className="tech-marquee">
      <div className="tech-marquee-inner">
        {[...group.items, ...group.items].map((item, i) => {
          const Icon = item.icon;
          return (
            <div className="tech-pill" key={item.name + i}>
              {Icon && <Icon className="tech-icon" />}
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
))}

      </div>
    </section>
  );
}
