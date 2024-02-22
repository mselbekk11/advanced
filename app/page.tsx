import Image from 'next/image';
import Hero from './components/Home/Hero';
import Appliances from './components/Home/Appliances';
import HeroTwo from './components/Home/HeroTwo';

export default function Home() {
  return (
    <section>
      {/* <Hero /> */}
      <HeroTwo />
      <Appliances />
    </section>
  );
}
