import Navbar from '@/components/Navbar/Navbar';
import TopBar from '@/components/TopBar/TopBar';
import Tracker from '@/components/Tracker/Tracker';

export default function TrackerPage() {
  return (
    <>
      <TopBar title="Mood Tracker" subtitle="Your emotional journey" />
      <Tracker />
      <Navbar />
    </>
  );
}
