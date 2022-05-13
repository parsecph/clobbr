import { GlobalStore } from 'App/globalContext';
import Logo from 'shared/brand/logo-primary.svg';
import LogoSecondary from 'shared/brand/logo-secondary.svg';

const Topbar = () => {
  return (
    <GlobalStore.Consumer>
      {({ themeMode }) => (
        <header className="flex justify-between w-full px-4 py-6 sticky top-0 z-10 bg-gray-100/70 dark:bg-black/30 backdrop-blur-sm transition-all">
          <img
            src={themeMode === 'dark' ? Logo : LogoSecondary}
            alt="Clobbr Logo Symbol (the letter C on a grid)"
            className="h-10 w-auto"
          />
        </header>
      )}
    </GlobalStore.Consumer>
  );
};

export default Topbar;
