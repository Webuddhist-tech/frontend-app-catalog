import { STATUS_MESSAGE_VARIANTS } from '../constants';

export type StatusMessageVariant = typeof STATUS_MESSAGE_VARIANTS[keyof typeof STATUS_MESSAGE_VARIANTS];

export interface EnrollmentButtonTypes {
  singlePaidMode: {};
  ecommerceCheckout: boolean;
  isEnrollmentPending: boolean;
  onEnroll: () => void;
  onEcommerceCheckout: () => void;
}

export interface EnrolledStatusTypes {
  courseId: string;
  enrollmentMode: string | null;
}

export interface StatusMessageTypes {
  variant: StatusMessageVariant;
  messageKey: string;
}

export interface InviteOnlyStatusTypes {
  courseId: string;
}
