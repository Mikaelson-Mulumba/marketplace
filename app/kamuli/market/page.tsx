import NavBar from "../../../components/NavBar";
import AdminSidebar from "../components/AdminSidebar";
import "../../../styles/globals.css";

export default function DashboardPage() {
  return (
    <div>
      <NavBar />
      <div className="admin-container">
        <AdminSidebar />
        <main className="admin-main">
          <div className="admin-topbar">
            <h1>Dashboard</h1>
          </div>
          <section className="admin-dashboard">
            <div className="dashboard-card">
              <h3>Welcome to the Dashboard</h3>
              <p>This is a placeholder. Add charts, stats, and analytics here.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
