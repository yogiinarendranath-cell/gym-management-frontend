import React, { useState, useEffect } from "react";
import './App.css';
import Layout from './components/Layout/Layout';

// Import Layout Components
//import Footer from "./components/common/Footer";
//import Logo from "./components/Branding/Logo";

// Import Page Components
import Footer from "./components/common/Footer";
import TermsOfService from "./components/Legal/TermsOfService";
import Logo from "./components/Branding/Logo";
import Attendance from "./components/Attendance/Attendance";
import Reports from "./components/Reports/Reports";
import EmailNotifications from "./components/Notifications/EmailNotifications";
import Analytics from "./components/Analytics/Analytics";
import WorkoutList from './components/Workouts/WorkoutList';
import TenantList from './components/Tenants/TenantList';
import InvoiceList from './components/Invoices/InvoiceList';
import Bookings from './components/Bookings/Bookings';
import MemberList from './components/Members/MemberList';
import ClassList from './components/Classes/ClassList';
import PaymentList from './components/Payments/PaymentList';
import SubscriptionList from './components/Subscriptions/SubscriptionList';
import Settings from './components/Settings/Settings';
import QRCodeScanner from './components/QRCode/QRCodeScanner';






// Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    premiumMembers: 0,
    revenue: 0,
    totalTrainers: 0,
    totalClasses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentMembers, setRecentMembers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5053/api/Dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });

    fetch("http://localhost:5053/api/Dashboard/recent-members")
      .then((res) => res.json())
      .then((data) => {
        setRecentMembers(data);
      })
      .catch((err) => console.error("Error fetching recent members:", err));
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading dashboard...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ color: "#6b7a8d", fontSize: "14px" }}>Total Members</div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            {stats.totalMembers || 0}
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ color: "#6b7a8d", fontSize: "14px" }}>Active Members</div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#27ae60",
            }}
          >
            {stats.activeMembers || 0}
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ color: "#6b7a8d", fontSize: "14px" }}>Premium Members</div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#8e44ad",
            }}
          >
            {stats.premiumMembers || 0}
          </div>
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ color: "#6b7a8d", fontSize: "14px" }}>Revenue</div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#27ae60",
            }}
          >
            ${stats.revenue || 0}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>
            Recent Members
          </h3>
          {recentMembers.slice(0, 5).map((m, i) => (
            <div
              key={i}
              style={{
                padding: "10px 0",
                borderBottom: i < 4 ? "1px solid #ecf0f1" : "none",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                <strong>{m.name}</strong>
              </span>
              <span style={{ color: "#6b7a8d" }}>{m.phone}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", color: "#2c3e50" }}>
            Quick Stats
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <strong>Trainers:</strong> {stats.totalTrainers || 0}
            </div>
            <div>
              <strong>Classes:</strong> {stats.totalClasses || 0}
            </div>
            <div>
              <strong>Active:</strong> {stats.activeMembers || 0}
            </div>
            <div>
              <strong>Premium:</strong> {stats.premiumMembers || 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Members Component
const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5053/api/Members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching members:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading members...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0, color: "#2c3e50" }}>👥 Members</h2>
        <span
          style={{
            background: "#ecf0f1",
            padding: "8px 16px",
            borderRadius: "20px",
            color: "#2c3e50",
          }}
        >
          Total: {members.length}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "15px",
        }}
      >
        {members.map((m) => (
          <div
            key={m.memberId || m.id}
            style={{
              background: "white",
              padding: "16px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #ecf0f1",
              transition: "transform 0.2s",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "#2c3e50",
              }}
            >
              {m.name}
            </div>
            <div style={{ color: "#6b7a8d", fontSize: "14px", marginTop: "4px" }}>
              📞 {m.phone || "N/A"}
            </div>
            <div style={{ marginTop: "8px" }}>
              <span
                style={{
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {m.membershipPlan?.name || m.membership || "Basic"}
              </span>
              <span
                style={{
                  marginLeft: "8px",
                  background: "#e3f2fd",
                  color: "#1565c0",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {m.status || "Active"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Trainers Component
const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5053/api/Trainers")
      .then((res) => res.json())
      .then((data) => {
        setTrainers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching trainers:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading trainers...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0, color: "#2c3e50" }}>🏋️ Trainers</h2>
        <span
          style={{
            background: "#ecf0f1",
            padding: "8px 16px",
            borderRadius: "20px",
            color: "#2c3e50",
          }}
        >
          Total: {trainers.length}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "15px",
        }}
      >
        {trainers.map((t) => (
          <div
            key={t.trainerID || t.id}
            style={{
              background: "white",
              padding: "16px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #ecf0f1",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "#2c3e50",
              }}
            >
              {t.name}
            </div>
            <div style={{ color: "#6b7a8d", fontSize: "14px", marginTop: "4px" }}>
              🎯 {t.specialty || "General"}
            </div>
            {t.email && (
              <div style={{ color: "#6b7a8d", fontSize: "13px" }}>
                ✉️ {t.email}
              </div>
            )}
            {t.phone && (
              <div style={{ color: "#6b7a8d", fontSize: "13px" }}>
                📞 {t.phone}
              </div>
            )}
            <div style={{ marginTop: "8px" }}>
              <span
                style={{
                  background: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {t.status || "Active"}
              </span>
              {t.experience && (
                <span
                  style={{
                    marginLeft: "8px",
                    color: "#6b7a8d",
                    fontSize: "13px",
                  }}
                >
                  ⏱ {t.experience} years
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Classes Component
const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5053/api/Classes")
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching classes:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading classes...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0, color: "#2c3e50" }}>📅 Classes</h2>
        <span
          style={{
            background: "#ecf0f1",
            padding: "8px 16px",
            borderRadius: "20px",
            color: "#2c3e50",
          }}
        >
          Total: {classes.length}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "15px",
        }}
      >
        {classes.map((c) => (
          <div
            key={c.classId || c.id}
            style={{
              background: "white",
              padding: "16px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #ecf0f1",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "18px",
                color: "#2c3e50",
              }}
            >
              {c.name}
            </div>
            <div style={{ color: "#6b7a8d", fontSize: "14px", marginTop: "4px" }}>
              🕐 {c.schedule || "TBD"}
            </div>
            {c.trainer && (
              <div style={{ color: "#6b7a8d", fontSize: "13px" }}>
                👨‍🏫 {c.trainer}
              </div>
            )}
            <div style={{ marginTop: "8px" }}>
              <span
                style={{
                  background: "#e3f2fd",
                  color: "#1565c0",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {c.status || "Active"}
              </span>
              {c.capacity && (
                <span
                  style={{
                    marginLeft: "8px",
                    color: "#6b7a8d",
                    fontSize: "13px",
                  }}
                >
                  👥 {c.capacity} seats
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Payments Component
const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5053/api/Payment")
      .then((res) => res.json())
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching payments:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        Loading payments...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0, color: "#2c3e50" }}>💳 Payments</h2>
        <span
          style={{
            background: "#ecf0f1",
            padding: "8px 16px",
            borderRadius: "20px",
            color: "#2c3e50",
          }}
        >
          Total: {payments.length}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "15px",
        }}
      >
        {payments.map((p) => (
          <div
            key={p.paymentId || p.id}
            style={{
              background: "white",
              padding: "16px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              border: "1px solid #ecf0f1",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "#27ae60",
              }}
            >
              ${p.amount || 0}
            </div>
            <div style={{ color: "#6b7a8d", fontSize: "14px", marginTop: "4px" }}>
              {p.memberName || "Member"}
            </div>
            <div style={{ marginTop: "8px" }}>
              <span
                style={{
                  background:
                    p.status?.toLowerCase() === "paid"
                      ? "#e8f5e9"
                      : p.status?.toLowerCase() === "pending"
                      ? "#fff3e0"
                      : "#ffebee",
                  color:
                    p.status?.toLowerCase() === "paid"
                      ? "#2e7d32"
                      : p.status?.toLowerCase() === "pending"
                      ? "#e65100"
                      : "#c62828",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {p.status || "Pending"}
              </span>
              {p.date && (
                <span
                  style={{
                    marginLeft: "8px",
                    color: "#6b7a8d",
                    fontSize: "13px",
                  }}
                >
                  📅 {new Date(p.date).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Terms of Service Component
const TermsOfServicePage = () => <TermsOfService />;

// Main App with Layout
function App() {
  const [page, setPage] = useState("dashboard");

  const pageNames = {
  // Main Modules
  dashboard: "📊 Dashboard",
  members: "👥 Members",
  trainers: "🏋️ Trainers",
  classes: "📚 Classes",
  payments: "💰 Payments",
  subscriptions: "📋 Subscriptions",
  bookings: "📅 Bookings",
  attendance: "✅ Attendance",
  
  // Additional Features
  workouts: "🏃 Workouts",
  tenants: "🏢 Tenants",
  invoices: "📄 Invoices",
  
  // Analytics & Reports
  reports: "📈 Reports",
  email: "✉️ Email",
  analytics: "📊 Analytics",
  
  // System
  settings: "⚙️ Settings",
  qrcodescan: "📱 QR Scan",
};
function App() {
  const [page, setPage] = useState("dashboard");

  // Category-based menu structure
  const menuStructure = [
    {
      category: "📊 Main",
      items: [
        { key: "dashboard", label: "Dashboard" }
      ]
    },
    {
      category: "👥 Management",
      items: [
        { key: "members", label: "Members" },
        { key: "trainers", label: "Trainers" },
        { key: "classes", label: "Classes" },
        { key: "subscriptions", label: "Subscriptions" }
      ]
    },
    {
      category: "💳 Operations",
      items: [
        { key: "payments", label: "Payments" },
        { key: "bookings", label: "Bookings" },
        { key: "attendance", label: "Attendance" }
      ]
    },
    {
      category: "🏋️ Fitness",
      items: [
        { key: "workouts", label: "Workouts" }
      ]
    },
    {
      category: "🏢 Business",
      items: [
        { key: "tenants", label: "Tenants" },
        { key: "invoices", label: "Invoices" }
      ]
    },
    {
      category: "📊 Analytics",
      items: [
        { key: "reports", label: "Reports" },
        { key: "analytics", label: "Analytics" }
      ]
    },
    {
      category: "✉️ Communication",
      items: [
        { key: "email", label: "Email" },
        { key: "qrcodescan", label: "QR Scan" }
      ]
    },
    {
      category: "⚙️ System",
      items: [
        { key: "settings", label: "Settings" }
      ]
    }
  ];
}
   const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard />;
      case "members": return <MemberList />;
      case "trainers": return <TrainerList />;
      case "classes": return <ClassList />;
      case "payments": return <PaymentList />;
      case "subscriptions": return <SubscriptionList />;
      case "bookings": return <Bookings />;
      case "attendance": return <Attendance />;
      case "workouts": return <WorkoutList />;
      case "tenants": return <TenantList />;
      case "invoices": return <InvoiceList />;
      case "reports": return <Reports />;
      case "email": return <EmailNotifications />;
      case "analytics": return <Analytics />;
      case "settings": return <Settings />;
      case "qrcodescan": return <QRCodeScanner />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout>
      {/* Navigation inside content area */}
      <nav
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          background: "white",
          padding: "10px 20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          flexWrap: "wrap",
        }}
      >
        {Object.keys(pageNames).map((key) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            style={{
              padding: "10px 24px",
              background: page === key ? "#2c3e50" : "transparent",
              color: page === key ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: page === key ? "600" : "400",
              transition: "all 0.3s",
              borderBottom: page === key ? "none" : "2px solid transparent",
            }}
          >
            {pageNames[key]}
          </button>
        ))}
      </nav>
      
      {/* Page Content */}
      {renderPage()}
    </Layout>
  );
}

export default App;