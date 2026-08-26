import { IntlShape } from '@edx/frontend-platform/i18n';

export interface GetSearchTitleProps {
  intl: IntlShape;
  searchString: string;
  courseDataResultsLength?: number;
}
