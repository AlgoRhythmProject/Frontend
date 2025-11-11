import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Lectures', path: '/lectures' },
    { name: 'Courses', path: '/courses' },
    { name: 'Tasks', path: '/tasks' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bg-black box-border flex items-center h-[46px] px-4 md:pl-[82px] md:pr-[76px] w-full">
      <div className="flex gap-4 md:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`font-sans font-medium text-[16px] md:text-[20px] text-center transition-colors ${isActive(item.path)
                ? 'text-foreground'
                : 'text-[#9e9e9e] hover:text-foreground'
              }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="ml-auto">
        <Link
          to="/profile"
          className={`font-sans font-medium text-[16px] md:text-[20px] text-center transition-colors ${isActive('/profile')
              ? 'text-foreground'
              : 'text-[#9e9e9e] hover:text-foreground'
            }`}
          style={{ fontVariationSettings: "'wdth' 100" }}
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
