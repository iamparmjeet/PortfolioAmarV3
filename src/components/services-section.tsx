import { IconBrandInstagram, IconCamera, IconMicrophone, IconMovie, IconVideo } from "@tabler/icons-react";

import Container from "./container";
import { OrangeHeading1 } from "./heading";
import { GlowingEffect } from "./ui/glowing-effect";

export default function ServicesSection() {
  return (
    <Container className="flex-col">
      <div className="text-center">
        <OrangeHeading1 text="My Services" className="text-3xl md:text-5xl font-extrabold" />
        <p className="text-neutral-300 text-base md:text-xl my-6 md:my-8 max-w-xl  mx-auto">
          Comprehensive video production services tailored to elevate your brand's visual presence
        </p>
      </div>
      <ServicesGrid />
    </Container>
  );
}

const GridItemsData = [
  {
    id: 1,
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
    icon: <IconBrandInstagram />,
    title: "Instagram Reels",
    description: "Engaging short-form videos tailored for Instagram.",
  },
  {
    id: 2,
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
    icon: <IconCamera />,
    title: "Photography",
    description: "High-quality photography services for products and events.",
  },
  {
    id: 3,
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
    icon: <IconVideo />,
    title: "Video Production",
    description: "Professional video production services for various needs.",
  },
  {
    id: 4,
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
    icon: <IconMovie />,
    title: "Video Editing",
    description: "Expert video editing services to enhance your footage.",
  },
  {
    id: 5,
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
    icon: <IconMicrophone />,
    title: "Podcast Production",
    description: "Full-service podcast production from recording to editing.",
  },
  // {
  //   id: 6,
  //   area: "md:[grid-area:4/2/6/13] xl:[grid-area:2/8/3/13]",
  //   icon: <IconBulbFilled />,
  //   title: "Concept Planning",
  //   description: "Creative concept planning for videos and podcasts.",
  // },
];

export function ServicesGrid() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:max-h-[34rem] xl:grid-rows-2">
      {GridItemsData.map(item => (
        <GridItem
          key={item.id}
          area={item.area}
          icon={item.icon}
          title={item.title}
          description={item.description}
        />
      ))}
    </ul>
  );
}

type GridItemProps = {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
};

function GridItem({ area, icon, title, description }: GridItemProps) {
  return (
    <li className={`min-h-[14rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-4">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
