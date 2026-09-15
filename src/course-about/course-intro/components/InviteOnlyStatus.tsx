import { useRef, useState } from 'react';
import {
  breakpoints, Stack, IconButton, OverlayTrigger, Tooltip, ModalDialog, useToggle, useMediaQuery,
} from '@openedx/paragon';
import { Close, HelpOutline } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import CourseAboutWishlistButtonSlot from '@src/plugin-slots/CourseAboutWishlistButtonSlot';
import { hasVisibleHtmlContent } from '../../utils';
import { getInviteInstructions } from '../invite-instructions/api';
import messages from '../messages';
import { STATUS_MESSAGE_VARIANTS } from '../constants';
import type { InviteOnlyStatusTypes } from './types';
import { StatusMessage } from './StatusMessage';

export const InviteOnlyStatus = ({ courseId }: InviteOnlyStatusTypes) => {
  const intl = useIntl();
  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const [inviteInstructions, setInviteInstructions] = useState<string | null>(null);
  // Matches EnrolledStatus's own threshold, so every one of these status
  // rows switches to stacked at the same point rather than each picking its
  // own — side by side, the pill was squeezing the buttons well before
  // actually running out of room, on laptop-width screens, not just phones.
  const isCompact = useMediaQuery({ maxWidth: breakpoints.large.maxWidth });
  // Most visitors never open this modal, so the fetch waits for the first
  // click rather than firing for every course-about page view. The ref (not
  // just checking inviteInstructions === null) is what stops a second open
  // from re-fetching — null is also the legitimate "no partner message" result.
  const hasFetchedInviteInstructions = useRef(false);

  const handleOpenModal = () => {
    openModal();
    if (!hasFetchedInviteInstructions.current) {
      hasFetchedInviteInstructions.current = true;
      getInviteInstructions(courseId)
        .then(setInviteInstructions)
        .catch((error) => logError('Failed to fetch invite instructions', error));
    }
  };

  return (
    <>
      <Stack direction={isCompact ? 'vertical' : 'horizontal'} gap={isCompact ? 2 : 3}>
        {/*
          The info button explains this message, so it stays glued to it on
          the same line no matter what — it's the Wishlist button (a wholly
          separate action) that moves to its own line once space is tight,
          not this one.
        */}
        <Stack direction="horizontal" gap={2}>
          <StatusMessage
            variant={STATUS_MESSAGE_VARIANTS.INFO}
            messageKey="statusMessageEnrollmentInvitationOnly"
          />
          <OverlayTrigger
            placement="top"
            overlay={(
              <Tooltip id="invite-info-tooltip" className="course-about-social-tooltip">
                {intl.formatMessage(messages.howToGetInviteBtn)}
              </Tooltip>
            )}
          >
            <IconButton
              src={HelpOutline}
              alt={intl.formatMessage(messages.howToGetInviteBtn)}
              onClick={handleOpenModal}
              className="course-about-invite-info-btn"
            />
          </OverlayTrigger>
        </Stack>
        <CourseAboutWishlistButtonSlot courseId={courseId} />
      </Stack>
      <ModalDialog
        title={intl.formatMessage(messages.inviteInstructionsModalTitle)}
        isOpen={isModalOpen}
        onClose={closeModal}
        hasCloseButton={false}
        isOverflowVisible={false}
        className="course-about-invite-modal"
      >
        <ModalDialog.Header>
          <ModalDialog.Title>
            {intl.formatMessage(messages.inviteInstructionsModalTitle)}
          </ModalDialog.Title>
        </ModalDialog.Header>
        <ModalDialog.Body>
          {hasVisibleHtmlContent(inviteInstructions) ? (
            // eslint-disable-next-line react/no-danger
            <div dangerouslySetInnerHTML={{ __html: inviteInstructions as string }} />
          ) : (
            intl.formatMessage(messages.inviteInstructionsModalBody, {
              supportEmail: getConfig().INFO_EMAIL,
            })
          )}
        </ModalDialog.Body>
        {/*
          A plain custom button, not ModalDialog's own close button: that one
          renders through several layers of Paragon's own components, each
          carrying its own size/colour tied to its own internal classes —
          repeatedly overriding it here kept losing to whichever of those
          wins the specificity tie, so this sidesteps the whole class of
          problem by not using it at all. Last child rather than first: it's
          positioned via absolute (see CSS), so its place in the DOM doesn't
          matter for where it appears, but Paragon rounds the modal's own
          top corners onto whichever element is `:first-child` — that needs
          to stay the Header, not this button.
        */}
        <button
          type="button"
          className="course-about-invite-modal-close-btn"
          onClick={closeModal}
          aria-label={intl.formatMessage(messages.closeModalBtn)}
        >
          <Close />
        </button>
      </ModalDialog>
    </>
  );
};

export default InviteOnlyStatus;
