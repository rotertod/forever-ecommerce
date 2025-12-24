import BestSeller from './BestSeller';
import Hero from './Hero';
import LatestCollection from './LatestCollection';
import NewsletterBox from './NewsletterBox';
import OurPolicy from './OurPolicy';

export default function Home() {
    return (
        <div>
            <Hero />
            <LatestCollection />
            <BestSeller />
            <OurPolicy />
            <NewsletterBox />
        </div>
    );
}
