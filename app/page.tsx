import DigitalPrintingThree from './components/DigitalPrintingThree';
import Appliances from './components/Home/Appliances';
import DigitalPrintingTwo from './components/Home/DigitalPrintingTwo';
import HeroThree from './components/Home/HeroThree';
import RxForm from './components/Home/rxform';

export default function Home() {
  return (
    <section>
      <HeroThree />
      <Appliances />
      {/* <DigitalPrintingTwo /> */}
      <DigitalPrintingThree />
      <RxForm />
    </section>
  );
}
