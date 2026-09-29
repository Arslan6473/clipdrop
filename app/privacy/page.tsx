import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Privacy Policy",
    description: `How ${siteConfig.name} handles your data: no accounts, no download history, and links processed only to fulfil your request.`,
    path: "/privacy",
  });
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      updated="September 29, 2026"
      intro={`${siteConfig.name} is built to work without knowing who you are. There are no accounts, and we avoid collecting or keeping data we don't need.`}
      sections={[
        {
          heading: "No accounts",
          body: (
            <p>
              You never need to sign up, log in or give us your name or email address to use {siteConfig.name}. We
              don&apos;t have user profiles, dashboards or saved settings tied to you.
            </p>
          ),
        },
        {
          heading: "Links you analyze",
          body: (
            <>
              <p>
                When you paste a link, it&apos;s sent to our server so we can identify the platform and ask that
                platform for the video&apos;s details and any available download options.
              </p>
              <ul>
                <li>Links aren&apos;t saved to a database, and there&apos;s no download history.</li>
                <li>Video details may be held in memory for up to a minute so a download can reuse them; they&apos;re then discarded automatically.</li>
                <li>
                  When we prepare a file for you (for example merging a video&apos;s picture and sound), it&apos;s kept
                  on our download server only long enough for you to fetch it and is deleted automatically, usually
                  within 15 minutes. We don&apos;t keep copies of media.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "Rate limiting and security",
          body: (
            <p>
              To keep the service reliable and prevent abuse, we count requests per IP address for a short time window.
              IP addresses are hashed in memory with a random key that changes whenever the server restarts, and counts
              expire after about a minute. Our hosting provider may keep standard server logs for security and
              operations.
            </p>
          ),
        },
        {
          heading: "Third-party platforms",
          body: (
            <p>
              To analyze a link we contact the platform it belongs to (for example YouTube or TikTok). Thumbnails are
              loaded through our image optimizer. Those platforms have their own privacy policies.
            </p>
          ),
        },
        {
          heading: "Cookies and analytics",
          body: (
            <p>
              {siteConfig.name} doesn&apos;t use advertising or tracking cookies. Your light/dark theme choice is stored
              in your browser&apos;s local storage. If we add analytics in the future, we&apos;ll use a privacy-focused,
              cookieless service that doesn&apos;t track you across sites, and update this page.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about privacy? Email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
