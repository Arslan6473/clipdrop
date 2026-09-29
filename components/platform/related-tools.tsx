import { Section } from "@/components/sections/section";
import { toolPageByPath } from "@/lib/content/tool-pages";
import { PlatformCard } from "./platform-card";

export function RelatedTools({ paths, title = "Related tools", muted }: { paths: string[]; title?: string; muted?: boolean }) {
  const tools = paths.map(toolPageByPath).filter((t) => t !== undefined);
  return (
    <Section id="related-tools" eyebrow="More tools" title={title} muted={muted}>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {tools.map((tool) => (
          <li key={tool.path}>
            <PlatformCard href={tool.path} name={tool.name} platform={tool.platform} description={tool.hero.description.split(".")[0]} className="[&>p:last-child]:line-clamp-2" />
          </li>
        ))}
      </ul>
    </Section>
  );
}
