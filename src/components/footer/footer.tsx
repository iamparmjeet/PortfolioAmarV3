import { IconBrandWhatsapp, IconMail, IconMap2 } from "@tabler/icons-react";
import Link from "next/link";

import Container from "../container";
import Logo from "../header/logo";
import SocialsBox from "../socials";
import FooterCopyright from "./footer-copyright";

export default function Footer() {
  return (
    <footer>
      <Container className="flex-col w-full">
        <Logo />
        <FooterUpper />
        <FooterCopyright />
      </Container>
    </footer>
  );
}

function FooterUpper() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:rounded-md my-0 md:my-8 container mx-auto px-4 py-12">
      <Social />
      <QuickLinks />
      <Services />
      <Contact />
    </section>
  );
}

function Social() {
  return (
    <div>
      <Heading title="Stay Connected" />
      <SocialsBox />
    </div>
  );
}

const QuickLinksItems = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/works",
    label: "Works",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

function QuickLinks() {
  return (
    <div>
      <Heading title="Quick Links" />
      <ul className="space-y-4">
        {QuickLinksItems.map(item => (
          <LinkBox
            key={item.label}
            href={item.href}
            label={item.label}
          />
        ))}
      </ul>
    </div>
  );
}

type LinkBoxProps = {
  label: string;
  href: string;
};

function LinkBox({ label, href }: LinkBoxProps) {
  return (
    <li>
      <Link href={href} className="text-neutral-400 hover:text-neutral-300 transition-colors">
        {label}
      </Link>
    </li>
  );
}

const ServicesItems = [
  {
    id: 1,
    href: "#",
    label: "Video Production",
  },
  {
    id: 2,
    href: "#",
    label: "Video Editing",
  },
  {
    id: 3,
    href: "#",
    label: "Podcast Production",
  },
  {
    id: 4,
    href: "#",
    label: "Social Media Content",
  },
  {
    id: 5,
    href: "#",
    label: "Product Photography",
  },
];

function Services() {
  return (
    <div>
      <Heading title="Services" />
      <ul className="space-y-4">
        {ServicesItems.map(item => (
          <LinkBox
            key={item.label}
            href={item.href}
            label={item.label}
          />
        )) }
      </ul>
    </div>
  );
}

const ContactItems = [
  {
    id: 1,
    href: "#",
    label: "Ludhiana, Punjab",
    icon: <IconMap2 className="w-5 h-5 shrink-0" />,
  },
  {
    id: 2,
    href: "wa.me/+919780189866",
    label: "(+91) 97801-89866",
    icon: <IconBrandWhatsapp className="w-5 h-5 shrink-0" />,
  },
  {
    id: 3,
    href: "mailto:info@amarjeetmishra.com",
    label: "info@amarjeetmishra.com",
    icon: <IconMail className="w-5 h-5 shrink-0" />,
  },
];

type ContactItemProps = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function ContactItemListBox({ label, href, icon }: ContactItemProps) {
  return (
    <a
      href={href}
      className="flex gap-2 items-center text-neutral-400 hover:text-neutral-300 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
      {label}
    </a>
  );
}

function Contact() {
  return (
    <div>
      <Heading title="Contact" />
      <ul className="space-y-4">
        {ContactItems.map(item => (
          <ContactItemListBox
            key={item.id}
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </ul>
    </div>
  );
}

function Heading({ title }: { title: string }) {
  return (
    <h3 className="text-lg text-neutral-200 font-medium  mb-7">
      {title}
      {" "}
    </h3>
  );
}
