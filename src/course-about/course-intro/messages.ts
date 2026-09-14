import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  statusMessageEnrolled: {
    id: 'category.course-about.course-intro.status-message.enrolled',
    defaultMessage: 'You are enrolled in this course',
    description: 'The text for the status message when the user is enrolled in the course.',
  },
  viewCourseBtn: {
    id: 'category.course-about.course-intro.view-course-btn',
    defaultMessage: 'View course',
    description: 'The text for the button to view the course.',
  },
  statusMessageFull: {
    id: 'category.course-about.course-intro.status-message.full',
    defaultMessage: 'Course is full',
    description: 'The text for the status message when the course is full.',
  },
  statusMessageEnrollmentInvitationOnly: {
    id: 'category.course-about.course-intro.status-message.enrollment-invitation-only',
    defaultMessage: 'Enrollment in this course is by invitation only',
    description: 'The text for the status message when the enrollment is by invitation only.',
  },
  statusMessageEnrollmentClosed: {
    id: 'category.course-about.course-intro.status-message.enrollment-closed',
    defaultMessage: 'Enrollment is closed',
    description: 'The text for the status message when the enrollment is closed.',
  },
  enrollNowBtn: {
    id: 'category.course-about.course-intro.enroll-now-btn',
    defaultMessage: 'Enroll now',
    description: 'The text for the button to enroll in the course.',
  },
  enrollNowBtnPending: {
    id: 'category.course-about.course-intro.enroll-now-btn-pending',
    defaultMessage: 'Enrolling...',
    description: 'The text for the button to enroll in the course when the enrollment is pending.',
  },
  statusMessageEnrollmentError: {
    id: 'category.course-about.course-intro.status-message.enrollment-error',
    defaultMessage: 'An error occurred. Please try again later.',
    description: 'The text for the status message when an error occurs during enrollment.',
  },
  statusMessagePurchased: {
    id: 'category.course-about.course-intro.status-message.purchased',
    defaultMessage: 'You have purchased this course',
    description: 'The text for the status message when the user has a verified (paid) enrollment.',
  },
  howToGetInviteBtn: {
    id: 'category.course-about.course-intro.how-to-get-invite-btn',
    defaultMessage: 'How to get an invite',
    description: 'Label and tooltip for the button that opens the invite-only help modal.',
  },
  inviteInstructionsModalTitle: {
    id: 'category.course-about.course-intro.invite-instructions-modal.title',
    defaultMessage: 'How to get an invite',
    description: 'Title of the modal explaining how to get invited to an invitation-only course.',
  },
  inviteInstructionsModalBody: {
    id: 'category.course-about.course-intro.invite-instructions-modal.body',
    defaultMessage: 'Enrollment in this course is managed by the organization offering it. Please contact your program administrator or {supportEmail} for information on how to receive an invitation.',
    description: 'Placeholder body text for the invite-only help modal, shown until each partner can supply its own message.',
  },
  closeModalBtn: {
    id: 'category.course-about.course-intro.close-modal-btn',
    defaultMessage: 'Close',
    description: 'Label for the button that closes the invite-instructions modal.',
  },
  checkingEnrollmentOptionsBtn: {
    id: 'category.course-about.course-intro.checking-enrollment-options-btn',
    defaultMessage: 'Loading...',
    description: 'The text for the enrollment button while it is still checking whether this course can be purchased, before the user has clicked anything.',
  },
  buyCourseBtn: {
    id: 'category.course-about.course-intro.buy-course-btn',
    defaultMessage: 'Buy Course',
    description: 'The text for the button to purchase a course that has a purchase link.',
  },
});

export default messages;
