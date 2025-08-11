import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import Link from "next/link";

import { socials } from "@/lib/data";
import { cn } from "@/lib/utils";

type SocialsType = {
  id: number;
  label: string;
  href: string;
  icon: React.ReactNode;
};

const Socials: SocialsType[] = [
  {
    id: 1,
    label: "Follow on Instagram",
    href: socials.insta,
    icon: (
      <IconBrandInstagram
        className="hover:fill-neutral-400 hover:stroke-neutral-300 w-7 h-7 "
      />
    ),
  },
  {
    id: 2,
    label: "Follow on Twitter",
    href: socials.twitter,
    icon: (
      <IconBrandTwitter
        className="hover:fill-neutral-400 hover:stroke-neutral-300 w-7 h-7 "
      />
    ),
  },
  {
    id: 3,
    label: "Subscribe on Youtube",
    href: socials.youtube,
    icon: (
      <IconBrandYoutube
        className="hover:fill-neutral-400 hover:stroke-neutral-300 w-7 h-7 "
      />
    ),
  },
];

type SocialBoxProps = {
  isRow?: boolean;
  className?: string;
};

export default function SocialsBox({ isRow = false, className }: SocialBoxProps) {
  return (
    <div className={cn(isRow ? "flex gap-4" : "space-y-4")}>
      {Socials.map(social => (
        <SocialIcon
          key={social.id}
          href={social.href}
          icon={social.icon}
          label={social.label}
          isRow={isRow}
          className={className}
        />
      ))}
    </div>
  );
}

type SocialIconType = {
  href: string;
  label: string;
  icon: React.ReactNode;
  isRow: boolean;
  className?: string;
};

function SocialIcon({ href, icon, label, isRow, className }: SocialIconType) {
  return (
    <Link
      href={href}
      className={cn(
        className,
        "flex items-center gap-2 text-neutral-400 hover:text-neutral-300 transition-colors",
        (isRow ? "flex-col" : "flex-row"),
      )}
    >
      {icon}
      {!isRow && <p>{ label }</p>}
    </Link>
  );
}
