import { IconMessage2Heart } from "@tabler/icons-react";

const reviews = [
  {
    key: 1,
    name: "Amit",
    company: "Dada Motors",
    text: "“Amarjeet’s launch reel for our new SUV lineup won ‘Best Reel of the Quarter’ at our dealer network meet. The edit was sharp, specs-driven, and perfectly timed to the beat. We saw a 38% lift in test-drive bookings and a 22% increase in weekend showroom footfall within two weeks. Our sales team now uses his reels in WhatsApp follow-ups—conversion rates have clearly improved.”",
  },
  {
    key: 2,
    name: "Rahul Mehta",
    company: "Fitness Coach",
    text: "“Amarjeet’s 4-week reel series for my transformation won ‘Top Fitness Reel’ in our gym community. The edits were razor-sharp, beat-synced, and CTA-led. We saw a 35% spike in trial session bookings and a 20% rise in paid plans within two weeks. I now use his reels in WhatsApp follow-ups—conversion rates and DM enquiries have clearly improved.”",
  },
];

export default function ReviewsComponent() {
  return (
    <section className="flex flex-col items-center gap-6">
      <IconMessage2Heart className="stroke-green-400 size-10" />
      <h2 className="text-5xl text-center">What clients say about us</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {reviews.map(review => (
          <ReviewComponent
            key={review.key}
            review={review}
          />
        ))}
      </div>
    </section>
  );
}

type ReviewSectionsType = {
  key: number;
  name: string;
  company: string;
  text: string;
};

type ReviewComponentType = {
  review: ReviewSectionsType;
};

function ReviewComponent({ review }: ReviewComponentType) {
  return (
    <div className="p-10 rounded-2xl bg-white/5">
      <p className="font-medium text-xl mb-4">{review.text}</p>
      <div className="flex gap-4 items-center">
        <p className="size-10 bg-gray-200 rounded-full"></p>
        <div>
          <p className="text-2xl font-medium">{review.name}</p>
          <small className="text-neutral-400">{review.company}</small>
        </div>
      </div>
    </div>
  );
}
