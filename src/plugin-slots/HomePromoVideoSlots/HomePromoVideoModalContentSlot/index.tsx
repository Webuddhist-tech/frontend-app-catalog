import { useIntl } from '@edx/frontend-platform/i18n';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

import { IFRAME_FEATURE_POLICY } from '@src/constants';
import messages from '@src/generic/video-modal/messages';
import type { HomePromoVideoModalContentSlotProps } from './types';

export const HomePromoVideoModalContentSlot = ({
  videoId,
}: HomePromoVideoModalContentSlotProps) => {
  const intl = useIntl();

  return (
    <PluginSlot
      id="org.openedx.frontend.catalog.home_page.promo_video_modal_content"
      slotOptions={{ mergeProps: true }}
      pluginProps={{ videoId }}
    >
      <iframe
        title={intl.formatMessage(messages.videoIframeTitle)}
        className="video-modal-iframe"
        src={`//www.youtube.com/embed/${videoId}?showinfo=0`}
        frameBorder="0"
        allowFullScreen
        allow={IFRAME_FEATURE_POLICY}
      />
    </PluginSlot>
  );
};
