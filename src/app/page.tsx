import Navbar from '@/components/Navbar/Navbar';
import TopBar from '@/components/TopBar/TopBar';
import MoodMusic from '@/components/MoodMusic/MoodMusic';
import RatingPopup from '@/components/RatingPopup/RatingPopup';

export default function HomePage() {
  return (
    <>
      <TopBar />
      <MoodMusic />
      <Navbar />
      <RatingPopup />
    </>
  );
}
