export type Profile = {
  name: string;
  username: string;
  role: string;
  bio: string;
  completion?: number;
};

export type Project = {
  _id: string;
  title: string;
  description: string;
  liveUrl?: string;
  visibility: "public" | "private";
  order: number;
};

export type Experience = {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  order: number;
};
