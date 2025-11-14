import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
          <p className="text-2xl text-slate-600 mb-2">Page not found</p>
          <p className="text-slate-600 mb-8">
            The page <code className="bg-slate-100 px-2 py-1 rounded text-red-600">{location.pathname}</code> doesn't exist.
          </p>
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
