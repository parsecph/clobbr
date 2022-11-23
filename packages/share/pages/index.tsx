import type { NextPage } from 'next';
import { Topbar } from '../components/topbar/topbar';

const Home: NextPage = () => {
  return (
    <div className="fancyOverlay">
      <main>
        <Topbar />
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
