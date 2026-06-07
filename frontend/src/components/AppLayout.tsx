import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <Link
          to="/"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <h1 style={{ margin: 0 }}>Sanctions Entity Explorer</h1>
        </Link>
        <p style={{ margin: "0.5rem 0 0", color: "#555" }}>
          Search sanctions entities and explore relationship graphs.
        </p>
      </header>
      <Outlet />
    </div>
  );
}
