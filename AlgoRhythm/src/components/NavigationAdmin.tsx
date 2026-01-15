import { AdminProfileDropdown } from './AdminProfileDropdown';
import { ThemeToggle } from './ThemeToggle';

export function NavigationAdmin() {
  return (
    <div className="bg-primary-background box-border flex items-center h-15 px-4 md:pl-20.5 md:pr-19 w-full">

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <AdminProfileDropdown />
      </div>
    </div >
  );
}
