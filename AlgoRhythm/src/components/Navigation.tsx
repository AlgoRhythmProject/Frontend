import { Link, useLocation } from 'react-router-dom';
import { ProfileDropdown } from './ProfileDropdown';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Lectures', path: '/lectures' },
    { name: 'Courses', path: '/courses' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Visualizations', path: '/visualize'},
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-primary-background box-border flex items-center h-15 px-4 md:pl-20.5 md:pr-19 w-full">
      <div className="flex gap-4 md:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`font-sans font-medium text-[16px] md:text-[20px] text-center transition-colors ${isActive(item.path)
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
              }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="ml-auto gap-4 flex">
        <ProfileDropdown />
        <ThemeToggle />
      </div>

    </div>
  );
}
