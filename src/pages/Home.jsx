import Navbar from '../components/home/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Pricing from '../components/home/Pricing';
import CTA from '../components/home/CTA';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;