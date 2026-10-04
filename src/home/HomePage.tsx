import { Head } from '@src/generic';
import HomeBannerSlot from '../plugin-slots/HomeBannerSlot';
import HomeCoursesListSlot from '../plugin-slots/HomeCoursesListSlot';
import RebrandNotice from './components/rebrand-notice/RebrandNotice';

const HomePage = () => (
  <>
    <Head />
    <RebrandNotice />
    <HomeBannerSlot />
    <HomeCoursesListSlot />
  </>
);

export default HomePage;
