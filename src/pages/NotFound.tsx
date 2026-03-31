import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `404 Error: Route not found → ${location.pathname}`
      );
    }
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <section className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold tracking-tight mb-4">
          404
        </h1>

        <p className="text-xl text-muted-foreground mb-6">
          Sorry, the page you’re looking for doesn’t exist.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Go Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md border hover:bg-accent transition"
          >
            Go Back
          </button>
        </div>
      </section>
    </main>
  );
};

export default NotFound;