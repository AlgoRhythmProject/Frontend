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
    <div className="bg-black box-border content-center flex flex-wrap gap-4 md:gap-[670px] h-[46px] items-center overflow-clip px-4 md:pl-[82px] md:pr-[76px] py-0 rounded-bl-[10px] rounded-br-[10px] shadow-[0px_4px_30px_10px_rgba(0,0,0,0.25)] w-full">
      <div className="content-stretch flex items-center justify-between gap-4 md:gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`font-sans font-medium text-[16px] md:text-[20px] text-center transition-colors ${isActive(item.path) ? 'text-foreground' : 'text-[#9e9e9e] hover:text-foreground'
              }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <Link
        to="/profile"
        className={`font-sans font-medium text-[16px] md:text-[20px] text-center transition-colors ${isActive('/profile') ? 'text-foreground' : 'text-[#9e9e9e] hover:text-foreground'
          }`}
        style={{ fontVariationSettings: "'wdth' 100" }}
      >
        Profile
      </Link>
    </div>
  );
}
