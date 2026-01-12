import { ThemeToggle } from './ThemeToggle';

export function NavigationAdmin() {
  return (
    <div className="bg-primary-background box-border flex items-center h-[60px] px-4 md:pl-[82px] md:pr-[76px] w-full">

      <div className="ml-auto gap-4 flex">
        <ThemeToggle />
      </div>

    </div>
  );
}
