import Navbar from '@/components/Navbar/Navbar';
import TopBar from '@/components/TopBar/TopBar';
import Diary from '@/components/Diary/Diary';

export default function DiaryPage() {
  return (
    <>
      <TopBar title="My Diary" subtitle="Write how you feel" />
      <Diary />
      <Navbar />
    </>
  );
}
