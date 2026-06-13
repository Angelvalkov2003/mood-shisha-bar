"use client";

import { motion } from "framer-motion";
import { SITE_NAME } from "@/lib/constants";
import { heroSubtitleFont, heroTaglineFont } from "@/lib/hero-fonts";
import { SocialLinks } from "@/components/site/social-links";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function TaglineText({ text }: { text: string }) {
  const split = text.split(/(sets the mood)/i);
  if (split.length <= 1) {
    return (
      <span className="bg-gradient-to-br from-white via-brand-light to-brand bg-clip-text text-transparent">
        {text}
      </span>
    );
  }

  return (
    <>
      <span className="text-white/95">{split[0]}</span>
      <span className="bg-gradient-to-r from-brand via-brand-light to-white bg-clip-text text-transparent">
        {split[1]}
      </span>
      {split[2] ? <span className="text-white/95">{split[2]}</span> : null}
    </>
  );
}

export function HomeHeroContent({
  tagline,
  subtitle,
}: {
  tagline: string;
  subtitle: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 text-center sm:px-6 sm:pb-24 sm:pt-20">
      <motion.p
        className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-brand/80"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.65, ease }}
      >
        {SITE_NAME}
      </motion.p>

      <motion.h1
        className={cn(
          heroTaglineFont.className,
          "hero-tagline mx-auto max-w-4xl overflow-hidden text-[2rem] font-extrabold uppercase leading-[1.05] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-[4.5rem] lg:leading-[1.02]",
        )}
        initial={{ opacity: 0, x: -56, filter: "blur(6px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        transition={{ delay: 0, duration: 0.85, ease }}
      >
        <TaglineText text={tagline} />
      </motion.h1>

      <motion.p
        className={cn(
          heroSubtitleFont.className,
          "hero-subtitle mx-auto mt-6 max-w-2xl text-xl leading-snug tracking-[0.02em] text-brand-light/90 sm:mt-7 sm:text-2xl md:text-[1.65rem]",
        )}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.65, duration: 0.65, ease }}
      >
        {subtitle}
      </motion.p>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.35, duration: 0.7, ease }}
      >
        <SocialLinks
          showTikTok={false}
          iconClassName="h-7 w-7 text-brand transition hover:scale-110 hover:text-brand-light sm:h-8 sm:w-8"
        />
      </motion.div>
    </div>
  );
}
