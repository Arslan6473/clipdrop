import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/sections/legal-page";
import { siteConfig } from "@/lib/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Terms of Use",
    description: `The rules for using ${siteConfig.name}, including your responsibility to only download content you have the right to download.`,
    path: "/terms",
  });
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      path="/terms"
      updated="September 29, 2026"
      intro={`By using ${siteConfig.name}, you agree to these terms. They're short, and they matter.`}
      sections={[
        {
          heading: "Your responsibility",
          body: (
            <>
              <p>You may only use {siteConfig.name} to download content that:</p>
              <ul>
                <li>you own or created;</li>
                <li>you have explicit permission from the rights holder to download;</li>
                <li>is in the public domain; or</li>
                <li>the platform or its license makes available for downloading.</li>
              </ul>
              <p>
                You&apos;re solely responsible for making sure you have the necessary rights or permissions, and for
                complying with the terms of the platform the content comes from.
              </p>
            </>
          ),
        },
        {
          heading: "What you must not do",
          body: (
            <ul>
              <li>Use the service to infringe copyright or other rights.</li>
              <li>Attempt to bypass DRM, authentication, paywalls, private-content settings or other access controls.</li>
              <li>Probe, scan or attack the service, or use it to reach internal or private networks.</li>
              <li>Send automated or excessive requests that degrade the service for others.</li>
            </ul>
          ),
        },
        {
          heading: "How the service works",
          body: (
            <p>
              {siteConfig.name} only works with publicly accessible content. It never signs in to platforms on
              your behalf and never bypasses DRM, logins or privacy settings. Some platforms&apos; own terms restrict
              downloading; it&apos;s your responsibility to follow them. Availability can change at any time.
            </p>
          ),
        },
        {
          heading: "No warranty",
          body: (
            <p>
              The service is provided “as is”, without warranties of any kind. We don&apos;t guarantee that any link,
              format or platform will be available, and we aren&apos;t liable for how you use downloaded content.
            </p>
          ),
        },
        {
          heading: "Copyright complaints",
          body: (
            <p>
              See our <Link href="/copyright">Copyright page</Link> for how to contact us.
            </p>
          ),
        },
        {
          heading: "Changes",
          body: <p>We may update these terms. Continued use after changes means you accept the updated terms.</p>,
        },
      ]}
    />
  );
}
