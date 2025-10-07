
export type User = {
  id: number;
  username: string;
  name?: string;
  avatar?: {
    tmdb?: {
      avatar_path: string;
    };
  };
};

export type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};