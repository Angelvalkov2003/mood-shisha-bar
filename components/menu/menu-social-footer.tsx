import { SocialLinks } from "@/components/site/social-links";

export function MenuSocialFooter() {
  return (
    <footer className="mt-auto px-4 pt-10 pb-8">
      <SocialLinks iconClassName="h-7 w-7 text-brand transition hover:opacity-80" />
    </footer>
  );
}
