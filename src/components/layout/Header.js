export default function Header() {
  return (
    <div className="navbar bg-base-200 lg:hidden">
      <div className="flex-none">
        <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <h1 className="text-xl font-bold">Daily Planner</h1>
      </div>
    </div>
  );
}
