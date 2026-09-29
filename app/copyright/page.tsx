import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Copyright",
    description: `${siteConfig.name}'s copyright policy: only download content you own or have permission to download, and how rights holders can contact us.`,
    path: "/copyright",
  });
}

export default function CopyrightPage() {
  return (
    <LegalPage
      title="Copyright"
      path="/copyright"
      updated="September 29, 2026"
      intro="Creators deserve control over their work. Here's how we approach copyright."
      sections={[
        {
          heading: "Download only what you're allowed to",
          body: (
            <p>
              Only download content you own, have permission to download, or that is otherwise legally available for
              downloading — such as public-domain works or videos a creator has explicitly made downloadable. Having a
              link to a video doesn&apos;t mean you have the right to download it.
            </p>
          ),
        },
        {
          heading: "We don't host content",
          body: (
            <p>
              {siteConfig.name} doesn&apos;t host, store or re-distribute media. Downloads are delivered directly from
              the source to the user&apos;s device, and only through mechanisms the source makes available.
            </p>
          ),
        },
        {
          heading: "For rights holders",
          body: (
            <>
              <p>If you believe {siteConfig.name} is being used to infringe your rights, contact us with:</p>
              <ul>
                <li>your name and contact details;</li>
                <li>a description of the copyrighted work;</li>
                <li>the URL(s) of the content concerned;</li>
                <li>a statement that you have a good-faith belief the use isn&apos;t authorized; and</li>
                <li>a statement that the information is accurate and that you&apos;re the rights holder or authorized to act for them.</li>
              </ul>
              <p>
                Email: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
              </p>
              <p>We&apos;ll review every notice and can block specific URLs or sources from being processed.</p>
            </>
          ),
        },
      ]}
    />
  );
}
