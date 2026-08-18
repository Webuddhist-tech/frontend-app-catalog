import { Link } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { ROUTES } from '@src/routes';
import type { HeroCourse } from '@src/data/hero-courses/types';
import messages from './messages';

interface HomeHeroCardProps {
  course: HeroCourse;
  /** Whether this card sits in front of the other in the stack. */
  isFront: boolean;
}

/**
 * Derives a short badge from a provider's name for when it has no logo on file.
 *
 * Takes the initial of each word so "Khyentse Foundation" reads as "KF",
 * capped at two so the badge cannot overflow.
 */
const getProviderInitials = (providerName: string) => providerName
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0].toUpperCase())
  .join('');

/**
 * One of the homepage hero's floating course cards.
 */
const HomeHeroCard = ({ course, isFront }: HomeHeroCardProps) => {
  const intl = useIntl();
  const {
    courseId, title, imageUrl, providerName, providerLogo, isNew, isEnrolled,
  } = course;

  const aboutPath = ROUTES.COURSE_ABOUT.replace(':courseId', courseId);
  const className = `home-hero__card ${isFront ? 'home-hero__card--front' : 'home-hero__card--back'}`;

  const body = (
    <>
      {/* Nested spans: the outer clips the inner band's ends to the corner,
          letting it sit at 45 degrees without a big overhang. Left readable by
          screen readers — nothing else on the card says the course is new. */}
      {isNew && (
        <span className="home-hero__card-ribbon">
          <span>{intl.formatMessage(messages.newCourse)}</span>
        </span>
      )}
      <span className="home-hero__card-image">
        {/* Decorative: the title beneath already names the course, so alt text
            here would only repeat it to a screen reader. */}
        {imageUrl && <img src={imageUrl} alt="" />}
      </span>
      <span className="home-hero__card-badge">
        {providerLogo
          ? (
            <img
              src={providerLogo}
              alt={intl.formatMessage(messages.providerLogoAlt, { providerName })}
            />
          )
          : providerName && <span aria-hidden="true">{getProviderInitials(providerName)}</span>}
      </span>
      <span className="home-hero__card-text">
        {providerName && <span className="home-hero__card-provider">{providerName}</span>}
        <span className="home-hero__card-title">{title}</span>
      </span>
    </>
  );

  // Enrolled goes straight to the courseware on the LMS, which lives outside
  // this app, so that leg cannot be a router Link. A curated pick the visitor
  // hasn't joined goes to the about page instead, rather than dropping them
  // into a course they can't yet access.
  if (isEnrolled) {
    return (
      <a className={className} href={`${getConfig().LMS_BASE_URL}/courses/${courseId}/course/`}>
        {body}
      </a>
    );
  }

  return <Link className={className} to={aboutPath}>{body}</Link>;
};

export default HomeHeroCard;
