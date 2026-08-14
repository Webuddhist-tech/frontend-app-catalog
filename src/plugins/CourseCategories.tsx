import { useState, useRef, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';

import { AlertNotification, CourseCard } from '@src/generic';
import { LoaderSlot } from '@src/plugin-slots/LoaderSlot';
import { useHomepageCategories } from '@src/data/homepage-categories/hooks';
import { SKELETON_CARD_COUNT } from '@src/data/homepage-categories/constants';
import { ROUTES } from '@src/routes';

import listMessages from '@src/home/components/courses-list/messages';
import messages from './CourseCategories.messages';

// Styles live in the brand package: brand-openedx/paragon/_catalog.scss,
// pulled in globally via src/index.scss.

const TITLE_ID = 'course-categories-title';

const CourseCategories = () => {
  const intl = useIntl();
  const { data: categories, isLoading, isError } = useHomepageCategories();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const tabRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  // Carried over from the course list this section replaces: some sites turn
  // course browsing off entirely.
  if (getConfig().NON_BROWSABLE_COURSES) {
    return null;
  }

  const heading = (
    <h2 id={TITLE_ID} className="course-categories__title">
      {intl.formatMessage(messages.title)}
    </h2>
  );

  if (isLoading) {
    return (
      <section className="course-categories" aria-labelledby={TITLE_ID}>
        {heading}
        <LoaderSlot>
          <div className="course-categories__grid" data-testid="course-categories-loading">
            {Array.from({ length: SKELETON_CARD_COUNT }, (_unused, index) => (
              <CourseCard key={`course-categories-skeleton-${index}`} isLoading />
            ))}
          </div>
        </LoaderSlot>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="course-categories" aria-labelledby={TITLE_ID}>
        {heading}
        <AlertNotification
          variant="danger"
          title={intl.formatMessage(messages.errorTitle)}
          message={intl.formatMessage(messages.errorMessage)}
        />
      </section>
    );
  }

  // Nothing categorised for the homepage means no section at all, matching the
  // old homepage, which wrapped this whole block in a conditional.
  if (!categories?.length) {
    return null;
  }

  // Derived rather than stored, so the first category is selected as soon as
  // the data lands without a render pass showing nothing selected.
  const active = categories.find(category => category.id === selectedId) ?? categories[0];

  const focusTab = (index: number) => {
    const target = categories[(index + categories.length) % categories.length];
    setSelectedId(target.id);
    tabRefs.current[target.id]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keyHandlers: Record<string, () => void> = {
      ArrowRight: () => focusTab(index + 1),
      ArrowLeft: () => focusTab(index - 1),
      Home: () => focusTab(0),
      End: () => focusTab(categories.length - 1),
    };

    const handler = keyHandlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  };

  return (
    <section className="course-categories" aria-labelledby={TITLE_ID}>
      {heading}

      <div
        className="course-categories__tabs"
        role="tablist"
        aria-label={intl.formatMessage(messages.tablistLabel)}
      >
        {categories.map((category, index) => {
          const isActive = category.id === active.id;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`course-category-tab-${category.id}`}
              aria-selected={isActive}
              aria-controls={`course-category-panel-${category.id}`}
              // Roving tabindex: the tab strip is one stop, arrows move within it.
              tabIndex={isActive ? 0 : -1}
              ref={(node) => { tabRefs.current[category.id] = node; }}
              className={`course-categories__tab${isActive ? ' course-categories__tab--active' : ''}`}
              onClick={() => setSelectedId(category.id)}
              onKeyDown={event => handleTabKeyDown(event, index)}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <div
        className="course-categories__grid"
        role="tabpanel"
        id={`course-category-panel-${active.id}`}
        aria-labelledby={`course-category-tab-${active.id}`}
      >
        {active.courses.map(course => (
          <CourseCard
            key={course.courseId}
            courseId={course.courseId}
            courseName={course.title}
            courseImageUrl={course.imageUrl ?? undefined}
            providerName={course.providerName ?? undefined}
            providerLogoUrl={course.providerLogo ?? undefined}
          />
        ))}
      </div>

      <div className="course-categories__actions">
        <Link className="course-categories__view-all" to={ROUTES.COURSES}>
          {intl.formatMessage(listMessages.viewAllCoursesButton)}
        </Link>
      </div>
    </section>
  );
};

export default CourseCategories;
