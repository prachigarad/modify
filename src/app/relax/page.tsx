import Navbar from '@/components/Navbar/Navbar';
import TopBar from '@/components/TopBar/TopBar';
import Relax from '@/components/Relax/Relax';

export default function RelaxPage() {
  return (
    <>
      <TopBar title="Relax" subtitle="Take a breath, slow down" />
      <Relax />
      <Navbar />
    </>
  );
}
