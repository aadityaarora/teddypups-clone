import { Chat } from "@/components/home/Chat";
import { Families } from "@/components/home/Families";
import { Hero } from "@/components/home/Hero";
import { Meet, type DoorPup } from "@/components/home/Meet";
import { Paths } from "@/components/home/Paths";
import { Questions } from "@/components/home/Questions";
import { Trust } from "@/components/home/Trust";
import { WelcomeHome } from "@/components/home/WelcomeHome";
import { chat, chatBreeds, homePhotos, homeSections } from "@/lib/data/home";
import { tones } from "@/lib/data/home-copy";
import { availablePuppies } from "@/lib/data/puppies";
import { site } from "@/lib/data/site";
import { testimonials } from "@/lib/data/testimonials";

// Only the fields the client door grid needs
const doorPups: DoorPup[] = availablePuppies.map((p) => ({
  id: p.id, slug: p.slug, name: p.name, displayName: p.displayName, breed: p.breed,
  genderLabel: p.genderLabel, age: p.age, status: p.status, cover: p.cover, hasVideo: p.video.length > 0,
}));

export default function Home() {
  return (
    <div data-page="home" className="tp-page">
      <div data-section="hero"><Hero /></div>
      <div data-section="meet"><Meet section={homeSections.meet} pups={doorPups} tone={tones.meet} /></div>
      <div data-section="paths"><Paths /></div>
      <div data-section="journey">
        <Chat section={homeSections.journey} tone={tones.journey} business={chat.business} greeting={chat.greeting} whatsappHref={site.whatsapp.href} breeds={chatBreeds} />
      </div>
      <div data-section="trust"><Trust /></div>
      <div data-section="families">
        <Families section={homeSections.families} photos={homePhotos} testimonial={testimonials[0]} tone={tones.families} />
      </div>
      <div data-section="questions"><Questions /></div>
      <div data-section="cta"><WelcomeHome /></div>
    </div>
  );
}
