import React, { useState, useEffect } from "react";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [membersRes, paymentsRes, classesRes] = await Promise.all([
        fetch("http://localhost:5053/api/Members"),
        fetch("http://localhost:5053/api/Payment"),
        fetch("http://localhost:5053/api/Classes")
      ]);

      const members = await membersRes.json();
      const payments = await paymentsRes.json();
      const classes = await classesRes.json();

      const totalMembers = members.length;
      const activeMembers = members.filter(m => m.status === "Active").length;
      const premiumMembers = members.filter(m => m.membershipPlanId === 2 || m.membershipPlanId === 3).length;
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const pendingPayments = payments.filter(p => p.status === "Pending").length;
      const totalClasses = classes.length;
      const activeClasses = classes.filter(c => c.status === "Active").length;

      const revenueByPlan = {};
      members.forEach(m => {
        const plan = m.membershipPlan?.name || "Basic";
        revenueByPlan[plan] = (revenueByPlan[plan] || 0) + (m.membershipPlan?.price || 0);
      });

      setAnalyticsData({
        totalMembers: totalMembers,
        activeMembers: activeMembers,
        premiumMembers: premiumMembers,
        totalRevenue: totalRevenue,
        pendingPayments: pendingPayments,
        totalClasses: totalClasses,
        activeClasses: activeClasses,
        revenueByPlan: revenueByPlan
      });
      setLoading(false);
    } catch (error) {
      console.error("Error loading analytics:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading analytics...</div>;
  }

  const colors = {
    "Basic": "#4CAF50",
    "Standard": "#2196F3",
    "Premium": "#FF9800",
    "VIP": "#9C27B0"
  };

  const planEntries = Object.entries(analyticsData.revenueByPlan);
  const totalRevenueAll = Object.values(analyticsData.revenueByPlan).reduce((a, b) => a + b, 0);

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "24px" }}>📊 Advanced Analytics</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e9edf4" }}>
          <div style={{ color: "#6b7a8d", fontSize: "13px" }}>Total Members</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#2c3e50" }}>{analyticsData.totalMembers}</div>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e9edf4" }}>
          <div style={{ color: "#6b7a8d", fontSize: "13px" }}>Active Members</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#2196F3" }}>{analyticsData.activeMembers}</div>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e9edf4" }}>
          <div style={{ color: "#6b7a8d", fontSize: "13px" }}>Revenue</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#4CAF50" }}>${analyticsData.totalRevenue}</div>
        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e9edf4" }}>
          <div style={{ color: "#6b7a8d", fontSize: "13px" }}>Active Classes</div>
          <div style={{ fontSize: "28px", fontWeight: "bold", color: "#9C27B0" }}>{analyticsData.activeClasses}</div>
        </div>
      </div>

      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e9edf4",
        marginBottom: "24px"
      }}>
        <h4 style={{ margin: "0 0 16px 0", color: "#2c3e50" }}>💰 Revenue by Plan</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {planEntries.map(function(item) {
            const plan = item[0];
            const amount = item[1];
            const percentage = totalRevenueAll > 0 ? Math.round((amount / totalRevenueAll) * 100) : 0;
            const color = colors[plan] || "#4CAF50";
            const widthValue = percentage + "%";
            return (
              <div key={plan} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "#6b7a8d", minWidth: "80px" }}>{plan}</span>
                <div style={{ flex: 1, height: "20px", background: "#f0f2f5", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{
                    width: widthValue,
                    height: "100%",
                    background: color,
                    borderRadius: "10px"
                  }} />
                </div>
                <span style={{ fontSize: "13px", fontWeight: "600", color: "#2c3e50", minWidth: "60px" }}>
                  ${amount}
                </span>
                <span style={{ fontSize: "12px", color: "#6b7a8d", minWidth: "35px" }}>{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px"
      }}>
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e9edf4" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#2c3e50" }}>📊 Key Metrics</h4>
          <div style={{ display: "grid", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7a8d" }}>Premium Members</span>
              <span style={{ fontWeight: "600" }}>{analyticsData.premiumMembers}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7a8d" }}>Pending Payments</span>
              <span style={{ fontWeight: "600", color: "#FF9800" }}>{analyticsData.pendingPayments}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#6b7a8d" }}>Total Classes</span>
              <span style={{ fontWeight: "600" }}>{analyticsData.totalClasses}</span>
            </div>
          </div>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e9edf4" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#2c3e50" }}>🎯 Quick Actions</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <button style={{ padding: "10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Generate Monthly Report
            </button>
            <button style={{ padding: "10px", background: "#2196F3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Export Analytics Data
            </button>
          </div>
        </div>

        <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e9edf4" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#2c3e50" }}>📋 Recent Activity</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ padding: "8px 0", borderBottom: "1px solid #eef2f7" }}>
              <span style={{ fontSize: "14px" }}>📈 {analyticsData.totalMembers} total members</span>
            </div>
            <div style={{ padding: "8px 0", borderBottom: "1px solid #eef2f7" }}>
              <span style={{ fontSize: "14px" }}>💰 ${analyticsData.totalRevenue} total revenue</span>
            </div>
            <div style={{ padding: "8px 0" }}>
              <span style={{ fontSize: "14px" }}>🏋️ {analyticsData.activeClasses} active classes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;