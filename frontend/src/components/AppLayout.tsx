import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="app-title-link">
          <h1 className="app-title">Sanctions Entity Explorer</h1>
        </Link>
        <p className="app-subtitle">
          Search sanctions entities and explore relationship graphs.
        </p>
      </header>
      <Outlet />
    </div>
  );
}
