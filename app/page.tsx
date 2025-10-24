import Trending from "@/components/Trending";
import HeroSection from "@/components/HeroSection";
import Discover from "@/components/Discover";
import WhatsPopular from "@/components/WhatsPopular";
import FreeToWatch from "@/components/FreeToWatch";
import LeaderBoard from "@/components/LeaderBoard";


export default function Home() {
  return (

    <div>
       {/* <HeroSection/> */}
       <Trending/>
       <Discover/>
       <WhatsPopular/>
       <FreeToWatch/>
       <LeaderBoard/>
    </div>
  );
}
