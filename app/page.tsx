import DigitalPrintingThree from './components/Home/DigitalPrintingThree';
import Appliances from './components/Home/Appliances';
import HeroThree from './components/Home/HeroThree';
import RxForm from './components/Home/rxform';

export default function Home() {
  return (
    <section>
      <HeroThree />
      <Appliances />
      <DigitalPrintingThree />
      <RxForm />
    </section>
  );
}
