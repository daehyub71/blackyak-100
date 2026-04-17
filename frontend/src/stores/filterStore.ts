import { create } from 'zustand';

export type Region =
  | '강원도'
  | '경기도'
  | '경상남도'
  | '경상북도'
  | '광주'
  | '대구'
  | '대전'
  | '부산'
  | '서울'
  | '울산'
  | '인천'
  | '전라남도'
  | '전라북도'
  | '제주도'
  | '충청남도'
  | '충청북도';

export type Difficulty = '쉬움' | '보통' | '어려움';
export type DurationBucket = '최단' | '2-3h' | '4-5h' | '5h+';
export type Season = '봄' | '여름' | '가을' | '겨울';

export interface FilterState {
  query: string;
  regions: Region[];
  difficulties: Difficulty[];
  durations: DurationBucket[];
  seasons: Season[];
}

interface FilterActions {
  setQuery: (query: string) => void;
  toggleRegion: (region: Region) => void;
  toggleDifficulty: (difficulty: Difficulty) => void;
  toggleDuration: (duration: DurationBucket) => void;
  toggleSeason: (season: Season) => void;
  clear: () => void;
}

const initialState: FilterState = {
  query: '',
  regions: [],
  difficulties: [],
  durations: [],
  seasons: [],
};

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setQuery: (query) => set({ query }),
  toggleRegion: (region) => set((s) => ({ regions: toggle(s.regions, region) })),
  toggleDifficulty: (difficulty) => set((s) => ({ difficulties: toggle(s.difficulties, difficulty) })),
  toggleDuration: (duration) => set((s) => ({ durations: toggle(s.durations, duration) })),
  toggleSeason: (season) => set((s) => ({ seasons: toggle(s.seasons, season) })),
  clear: () => set(initialState),
}));
