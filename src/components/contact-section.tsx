import NextVideo from "@/components/video/next-video";
import { URL } from "@/lib/data";

export default function ContactSection() {
  const item = `${URL}/assets/Videos/amar-in-action/1/master.m3u8`;
  return (
    <section id="contact" className="p-6 py-12 bg-black text-white mt-6 rounded-2xl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's create
              {" "}
              <span className="text-gold-400">together</span>
            </h2>
            <p className="text-gray-400 mb-8">
              Ready to bring your vision to life? Get in touch to discuss your project needs.
            </p>

            <Form />
          </div>

          <div className="relative h-auto rounded-lg overflow-hidden">
            <NextVideo
              href={item}
              thumbnail={item.replace(".m3u8", ".webp")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Form() {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-1">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
        </textarea>
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-black font-medium rounded-md transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
