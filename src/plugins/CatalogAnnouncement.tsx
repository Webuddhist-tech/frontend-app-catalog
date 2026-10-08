import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useHomepageAnnouncement } from '@src/data/catalog-announcement/hooks';
import type { HomepageAnnouncement } from '@src/data/catalog-announcement/types';
import messages from './CatalogAnnouncement.messages';

// Styles live in the brand package: brand-openedx/paragon/_catalog.scss,
// pulled in globally via src/index.scss.

// A signed-in close is remembered until that login ends. Logout leaves this
// record behind; the next login's id does not match it, so the banner returns.
const SIGNED_IN_DISMISSAL_KEY = 'sherab.catalog.announcement.dismissed';

// A signed-out close lasts for this tab only. Logging in ignores this record.
const SIGNED_OUT_DISMISSAL_KEY = 'sherab.catalog.announcement.dismissed.anonymous';

interface SignedInDismissal {
  message: string;
  sessionId: string;
}

const readItem = (storage: Storage, key: string) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const readSignedInDismissal = (): SignedInDismissal | null => {
  const raw = readItem(window.localStorage, SIGNED_IN_DISMISSAL_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<SignedInDismissal>;
    if (typeof parsed.message === 'string' && typeof parsed.sessionId === 'string') {
      return { message: parsed.message, sessionId: parsed.sessionId };
    }
  } catch {
    // Older builds stored the message alone. That record does not identify a
    // login, so it no longer hides the banner.
  }
  return null;
};

const isDismissed = (
  announcement: HomepageAnnouncement,
  signedInDismissal: SignedInDismissal | null,
  signedOutMessage: string | null,
) => {
  if (announcement.dismissalSessionId) {
    return signedInDismissal?.message === announcement.message
      && signedInDismissal.sessionId === announcement.dismissalSessionId;
  }
  return signedOutMessage === announcement.message;
};

const CatalogAnnouncement = () => {
  const intl = useIntl();
  const { data } = useHomepageAnnouncement();
  const [signedInDismissal, setSignedInDismissal] = useState(readSignedInDismissal);
  const [signedOutMessage, setSignedOutMessage] = useState(
    () => readItem(window.sessionStorage, SIGNED_OUT_DISMISSAL_KEY),
  );

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === SIGNED_IN_DISMISSAL_KEY) {
        setSignedInDismissal(readSignedInDismissal());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!data || isDismissed(data, signedInDismissal, signedOutMessage)) {
    return null;
  }

  const dismiss = () => {
    if (data.dismissalSessionId) {
      const dismissal = { message: data.message, sessionId: data.dismissalSessionId };
      try {
        window.localStorage.setItem(SIGNED_IN_DISMISSAL_KEY, JSON.stringify(dismissal));
      } catch {
        // Hide it for this view even when storage is blocked.
      }
      setSignedInDismissal(dismissal);
      return;
    }

    try {
      window.sessionStorage.setItem(SIGNED_OUT_DISMISSAL_KEY, data.message);
    } catch {
      // Hide it for this view even when storage is blocked.
    }
    setSignedOutMessage(data.message);
  };

  return (
    <section
      className={`catalog-announcement catalog-announcement--${data.tone}`}
      aria-label={intl.formatMessage(messages.label)}
    >
      <p className="catalog-announcement__message">{data.message}</p>
      <button
        type="button"
        className="catalog-announcement__dismiss"
        aria-label={intl.formatMessage(messages.dismiss)}
        onClick={dismiss}
      >
        <span aria-hidden="true">×</span>
      </button>
    </section>
  );
};

export default CatalogAnnouncement;
