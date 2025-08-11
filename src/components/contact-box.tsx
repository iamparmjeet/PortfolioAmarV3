import { IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "./ui/button";

export default function ContactBox() {
  return (
    <div className="space-y-6 p-6 md:p-8 py-20 rounded-2xl w-full bg-[url('https://media.amarjeetmishra.com/images/bg1.webp')] bg-cover bg-center hover:bg-bottom transition-all ">
      <div className="text-5xl md:text-7xl">
        <h2>Have an Idea?</h2>
        <h3 className="text-green-600">Let's Talk</h3>
      </div>
      <p className="text-xl md:text-2xl font-semibold text-pretty md:w-[39rem] ">We create experiences that fuel connections between brands and the people vital to their success.</p>
      <Button variant="orange" asChild size="lg" className="cursor-pointer">
        <Link href="/contact">
          <span>Contact Us</span>
          <IconArrowUpRight className="size-6" />
        </Link>
      </Button>
    </div>
  );
}
