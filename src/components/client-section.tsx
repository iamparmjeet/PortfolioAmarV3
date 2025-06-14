import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

import Container from "./container";
import { OrangeHeading1 } from "./heading";

export default function ClientSection() {
  return (
    <Container className="flex-col">
      <div className="text-center">
        <OrangeHeading1 text="Trusted by Clients" className="text-3xl md:text-5xl font-extrabold" />
        <p className="text-neutral-300 text-base md:text-xl max-w-2xl mx-auto mt-6">Proud to have worked with these amazing businesses</p>
      </div>
      <AnimatedTestimonialsDemo />
    </Container>
  );
}

function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: `https://picsum.photos/id/29/200`,
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: `https://picsum.photos/id/30/200`,
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: `https://picsum.photos/id/37/200`,
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: `https://picsum.photos/id/32/200`,
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: `https://picsum.photos/id/33/200`,
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
