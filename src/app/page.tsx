'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar/Navbar';
import TopBar from '@/components/TopBar/TopBar';
import MoodMusic from '@/components/MoodMusic/MoodMusic';
import RatingPopup from '@/components/RatingPopup/RatingPopup';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // While checking auth or not logged in — show nothing
  if (loading || !user) return null;

  return (
    <>
      <TopBar />
      <MoodMusic />
      <Navbar />
      <RatingPopup />
    </>
  );
}
