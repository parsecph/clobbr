import type { NextPage } from 'next';
import Image from 'next/image';
import { Topbar } from '@/components/topbar/topbar';
import { GenericFooter } from '@/components/footer/footer';
import Typography from '@mui/material/Typography';

const Home: NextPage = () => {
  return (
    <div>
      <main className="flex flex-col min-h-screen">
        <Topbar />

        <div className="flex flex-col items-center my-auto">
          <div className="p-6 max-w-lg">
            <Typography variant="h5" className="font-light">
              Share Clobbr results with your team easily and privately.
            </Typography>

            <Typography variant="body1" className="opacity-90 mt-2">
              Press the share button on any result to get a shareable link.
            </Typography>
          </div>

          <div className="flex justify-center mb-12">
            <Image
              alt="How to share api speed test on clobbr"
              src="/img/how-to-share-api-speed-test-on-clobbr.webp"
              className="w-full h-full max-w-2xl"
              width={1200}
              height={721}
            />
          </div>
        </div>

        <GenericFooter />
      </main>
    </div>
  );
};

export default Home;
