export interface HomepageCategoryCourse {
  courseId: string;
  title: string;
  imageUrl: string | null;
  /** Institution offering the course: its center, or its partner. */
  providerName: string | null;
  providerLogo: string | null;
}

export interface HomepageCategory {
  id: number;
  name: string;
  courses: HomepageCategoryCourse[];
}
