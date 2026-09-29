import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FaqSchema } from "@/components/seo/faq-schema";
import { Section } from "@/components/sections/section";
import type { FaqItem } from "@/lib/content/types";

export function PlatformFAQ({
  faqs,
  id = "faq",
  title = "Frequently asked questions",
  muted,
}: {
  faqs: FaqItem[];
  id?: string;
  title?: string;
  muted?: boolean;
}) {
  return (
    <Section id={id} eyebrow="FAQ" title={title} muted={muted}>
      <FaqSchema faqs={faqs} />
      <Accordion className="mx-auto max-w-3xl rounded-2xl border bg-card px-5 shadow-soft sm:px-7">
        {faqs.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger className="py-5 text-base font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
            <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
              <p>{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
