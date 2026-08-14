export interface CourseContent {
  displayName: string;
  overview?: string;
  number?: string;
}

export interface CourseData {
  id: string;
  course: string;
  start: string;
  imageUrl: string;
  org: string;
  orgImageUrl?: string;
  partnerLogoUrl?: string;
  advertisedStart?: string;
  content: CourseContent;
  number: string;
  modes: string[];
  language: string;
  catalogVisibility: string;
}

export interface Course {
  id: string;
  index?: string;
  type?: string;
  data: CourseData;
}

export interface CourseCardProps {
  isLoading?: boolean;
  courseId?: string;
  courseOrg?: string;
  courseName?: string;
  courseImageUrl?: string;
  /** Institution offering the course; falls back to courseOrg when unknown. */
  providerName?: string;
  /** Logo badged over the card image; omitted entirely when unavailable. */
  providerLogoUrl?: string;
  courseStartDate?: string;
  courseAdvertisedStart?: string;
  /** The homepage cards omit the start date; the catalog listing shows it. */
  showStartDate?: boolean;
}
