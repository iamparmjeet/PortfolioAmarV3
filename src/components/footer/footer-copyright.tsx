"use client";

const d = new Date();
const year = d.getFullYear();

export default function FooterCopyright() {
  return (
    <section className="w-full text-neutral-400 pt-6 md:pt-12 mx-auto text-start border-t border-white/10 ">
      <p>
        ©
        {" "}
        {year}
        {" "}
        All Rights Reserved | Made with ♡ by
        {" "}
        <a
          href="https://parmjeetmishra.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-orange-500"
        >
          Parm
        </a>
      </p>
    </section>
  );
}
