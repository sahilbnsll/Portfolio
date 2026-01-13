import data from "@/data/socials.json";
import { socialSchema } from "@/lib/schemas";
import Icon from "./Icon";

export default function Socials() {
  const socials = socialSchema.parse(data).socials;

  return (
    <section className="flex gap-6">
      {socials.map((item) => (
        <a
          href={item.href}
          key={item.name}
          target="_blank"
          className="group text-muted-foreground transition-all duration-300 hover:text-foreground"
          rel="noopener noreferrer"
          title={item.name}
          aria-label={item.name}
        >
          <span className="sr-only">{item.name}</span>
          <Icon name={item.icon} aria-hidden="true" className="size-5 transition-all duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_6px_rgba(139,92,246,0.4)]" />
        </a>
      ))}
    </section>
  );
}
