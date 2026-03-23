import Navbar from '@/components/Navbar/Navbar';
import TopBar from '@/components/TopBar/TopBar';
import Settings from '@/components/Settings/Settings';

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" subtitle="Customise your experience" />
      <Settings />
      <Navbar />
    </>
  );
}
