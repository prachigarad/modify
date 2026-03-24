import Navbar from '@/components/Navbar/Navbar';
import TopBar from '@/components/TopBar/TopBar';
import About from '@/components/About/About';

export default function AboutPage() {
  return (
    <>
      <TopBar title="About" subtitle="App & creator info" />
      <About />
      <Navbar />
    </>
  );
}
