import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        
        {/* Page content */}
        <div className="drawer-content flex flex-col">
          <Header />
          
          {/* Main content */}
          <main className="flex-1 p-4">
            <h2 className="text-2xl font-bold mb-4">Welcome to Your Daily Planner</h2>
            <p>Start organizing your day!</p>
          </main>
        </div>
        
        <Sidebar />
      </div>
    </div>
  );
}
