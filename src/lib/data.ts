export type Mood = 'happy' | 'sad' | 'calm' | 'energy' | 'focus' | 'love';

export interface Song {
  emoji: string;
  title: string;
  artist: string;
  youtubeQuery: string;
}

export interface DiaryEntry {
  id: string;
  text: string;
  emoji: string;
  mood: string;
  date: string;
  timestamp: number;
}

export interface MoodLog {
  [dateKey: string]: string; // dateKey = date string, value = emoji
}

export const MOODS: {
  id: Mood;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}[] = [
  { id: 'happy', label: 'Happy', emoji: '😄', color: '#E88D1A', bg: '#FFF5E0' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#2E7DD4', bg: '#E6F1FB' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#1A9E75', bg: '#E1F5EE' },
  {
    id: 'energy',
    label: 'Energetic',
    emoji: '⚡',
    color: '#D84A20',
    bg: '#FAECE7',
  },
  { id: 'focus', label: 'Focus', emoji: '🎯', color: '#7C5CFC', bg: '#EDE8FF' },
  { id: 'love', label: 'Love', emoji: '💕', color: '#C23066', bg: '#FBEAF0' },
];

export const SONGS: Record<Mood, Song[]> = {
  happy: [
    {
      emoji: '🎸',
      title: 'Good as Hell',
      artist: 'Lizzo',
      youtubeQuery: 'lizzo good as hell',
    },
    {
      emoji: '🎹',
      title: 'Happy',
      artist: 'Pharrell Williams',
      youtubeQuery: 'pharrell happy',
    },
    {
      emoji: '🎵',
      title: "Can't Stop the Feeling",
      artist: 'Justin Timberlake',
      youtubeQuery: 'cant stop the feeling timberlake',
    },
    {
      emoji: '🥁',
      title: 'Walking on Sunshine',
      artist: 'Katrina & The Waves',
      youtubeQuery: 'walking on sunshine katrina',
    },
    {
      emoji: '🎶',
      title: 'Shake It Off',
      artist: 'Taylor Swift',
      youtubeQuery: 'taylor swift shake it off',
    },
    {
      emoji: '🎙',
      title: 'Uptown Funk',
      artist: 'Bruno Mars',
      youtubeQuery: 'uptown funk bruno mars',
    },
  ],
  sad: [
    {
      emoji: '🎹',
      title: 'The Night We Met',
      artist: 'Lord Huron',
      youtubeQuery: 'lord huron night we met',
    },
    {
      emoji: '🎸',
      title: 'Someone Like You',
      artist: 'Adele',
      youtubeQuery: 'adele someone like you',
    },
    {
      emoji: '🎵',
      title: 'Fix You',
      artist: 'Coldplay',
      youtubeQuery: 'coldplay fix you',
    },
    {
      emoji: '🎶',
      title: 'Skinny Love',
      artist: 'Bon Iver',
      youtubeQuery: 'bon iver skinny love',
    },
    {
      emoji: '🎙',
      title: 'Fast Car',
      artist: 'Tracy Chapman',
      youtubeQuery: 'tracy chapman fast car',
    },
    {
      emoji: '🥁',
      title: 'Liability',
      artist: 'Lorde',
      youtubeQuery: 'lorde liability',
    },
  ],
  calm: [
    {
      emoji: '🎹',
      title: 'Weightless',
      artist: 'Marconi Union',
      youtubeQuery: 'marconi union weightless',
    },
    {
      emoji: '🎸',
      title: 'Clair de Lune',
      artist: 'Debussy',
      youtubeQuery: 'debussy clair de lune',
    },
    {
      emoji: '🎵',
      title: 'River Flows in You',
      artist: 'Yiruma',
      youtubeQuery: 'yiruma river flows in you',
    },
    {
      emoji: '🎶',
      title: 'Experience',
      artist: 'Einaudi',
      youtubeQuery: 'einaudi experience',
    },
    {
      emoji: '🎙',
      title: 'Orinoco Flow',
      artist: 'Enya',
      youtubeQuery: 'enya orinoco flow',
    },
    {
      emoji: '🥁',
      title: 'Gymnopédie No.1',
      artist: 'Erik Satie',
      youtubeQuery: 'satie gymnopedie no 1',
    },
  ],
  energy: [
    {
      emoji: '⚡',
      title: 'chal zero se chalte hain',
      artist: 'Vishal Mishra',
      youtubeQuery: 'chal zero se chalte hain vishal mishra',
    },
    {
      emoji: '🥁',
      title: 'Stronger',
      artist: 'Kanye West',
      youtubeQuery: 'kanye stronger',
    },
    {
      emoji: '🎸',
      title: 'Till I Collapse',
      artist: 'Eminem',
      youtubeQuery: 'eminem till i collapse',
    },
    {
      emoji: '🎵',
      title: 'Lose Yourself',
      artist: 'Eminem',
      youtubeQuery: 'eminem lose yourself',
    },
    {
      emoji: '🎶',
      title: 'Power',
      artist: 'Kanye West',
      youtubeQuery: 'kanye power',
    },
    {
      emoji: '🎙',
      title: 'Run The World',
      artist: 'Beyoncé',
      youtubeQuery: 'beyonce run the world',
    },
  ],
  focus: [
    {
      emoji: '🎹',
      title: 'Experience',
      artist: 'Einaudi',
      youtubeQuery: 'einaudi experience',
    },
    {
      emoji: '🎵',
      title: 'Interstellar OST',
      artist: 'Hans Zimmer',
      youtubeQuery: 'interstellar soundtrack hans zimmer',
    },
    {
      emoji: '🎶',
      title: 'Time',
      artist: 'Hans Zimmer',
      youtubeQuery: 'hans zimmer time inception',
    },
    {
      emoji: '🎸',
      title: "Comptine d'un autre",
      artist: 'Yann Tiersen',
      youtubeQuery: 'yann tiersen comptine dun autre',
    },
    {
      emoji: '🎙',
      title: 'Divenire',
      artist: 'Einaudi',
      youtubeQuery: 'einaudi divenire',
    },
    {
      emoji: '🥁',
      title: 'Nuvole Bianche',
      artist: 'Einaudi',
      youtubeQuery: 'einaudi nuvole bianche',
    },
  ],
  love: [
    {
      emoji: '💕',
      title: 'Bairan',
      artist: 'Banjaare',
      youtubeQuery: 'Bairan',
    },
    {
      emoji: '🎹',
      title: 'dekha ek khwab to ye silsile hue ',
      artist: 'kishore kumar and lata mangeshkar',
      youtubeQuery: 'dekha ek khwab to ye silsile hue ',
    },
    {
      emoji: '🎸',
      title: 'tere sang yaara ',
      artist: 'Atif Aslam',
      youtubeQuery: 'tere sang yaara ',
    },
    {
      emoji: '🎵',
      title: 'malang sajna',
      artist: 'Vishal Mishra',
      youtubeQuery: 'malang sajna vishal mishra',
    },
    {
      emoji: '🎶',
      title: 'Aksar is duniya mein',
      artist: 'Atif Aslam',
      youtubeQuery: 'aksar is duniya mein',
    },
    {
      emoji: '🎙',
      title: 'teri zhuki nazar',
      artist: 'Atif Aslam',
      youtubeQuery: 'teri zhuki nazar',
    },
  ],
};

export const QUOTES: Record<Mood, string[]> = {
  happy: [
    'Keep spreading that sunshine — it looks great on you.',
    'Joy is contagious. Share it generously.',
    'Your energy today is your gift to the world.',
  ],
  sad: [
    "It's okay to not be okay. This too shall pass.",
    'Every storm runs out of rain. Hold on.',
    "You're allowed to feel everything. It makes you human.",
  ],
  calm: [
    'In the stillness, you find yourself.',
    'Breathe in peace. Breathe out everything else.',
    'The quieter you become, the more you can hear.',
  ],
  energy: [
    "Channel that fire. You're unstoppable today.",
    'Your energy is your superpower. Use it well.',
    "The world can't keep up with you right now.",
  ],
  focus: [
    'One task. All attention. Extraordinary results.',
    'Deep work is your most valuable skill.',
    'Distraction is the enemy of greatness.',
  ],
  love: [
    'Love is the most powerful force in the universe.',
    'To love deeply is to live fully.',
    "The heart knows things the mind can't explain.",
  ],
};

// localStorage helpers
export const storage = {
  getEntries: (): DiaryEntry[] => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('moodify-entries') || '[]');
    } catch {
      return [];
    }
  },
  setEntries: (entries: DiaryEntry[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('moodify-entries', JSON.stringify(entries));
  },
  getLogs: (): MoodLog => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('moodify-logs') || '{}');
    } catch {
      return {};
    }
  },
  setLogs: (logs: MoodLog) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('moodify-logs', JSON.stringify(logs));
  },
  getTheme: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return (
      (localStorage.getItem('moodify-theme') as 'light' | 'dark') || 'light'
    );
  },
  setTheme: (t: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('moodify-theme', t);
  },
  getUsername: (): string => {
    if (typeof window === 'undefined') return 'Friend';
    return localStorage.getItem('moodify-username') || 'Friend';
  },
  setUsername: (name: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('moodify-username', name);
  },
};
