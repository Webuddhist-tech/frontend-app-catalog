import { useEffect, useState } from 'react';
import {
  Stack, IconButton, OverlayTrigger, Tooltip, ModalDialog, useToggle,
} from '@openedx/paragon';
import { HelpOutline } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import CourseAboutWishlistButtonSlot from '@src/plugin-slots/CourseAboutWishlistButtonSlot';
import { hasVisibleHtmlContent } from '../../utils';
import { getInviteInstructions } from '../invite-instructions/api';
import { CloseIcon } from '../icons';
import messages from '../messages';
import { STATUS_MESSAGE_VARIANTS } from '../constants';
import type { InviteOnlyStatusTypes } from './types';
import { StatusMessage } from './StatusMessage';

export const InviteOnlyStatus = ({ courseId }: InviteOnlyStatusTypes) => {
  const intl = useIntl();
  const [isModalOpen, openModal, closeModal] = useToggle(false);
  const [inviteInstructions, setInviteInstructions] = useState<string | null>(null);

  useEffect(() => {
    getInviteInstructions(courseId)
      .then(setInviteInstructions)
      .catch((error) => logError('Failed to fetch invite instructions', error));
  }, [courseId]);

  return (
    <>
      <Stack direction="horizontal" gap={3} className="flex-wrap">
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
            onClick={openModal}
            className="course-about-invite-info-btn"
          />
        </OverlayTrigger>
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
          <CloseIcon />
        </button>
      </ModalDialog>
    </>
  );
};

export default InviteOnlyStatus;
