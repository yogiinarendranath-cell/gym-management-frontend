import React, { useState, useEffect } from "react";

const Reports = () => {
  const [reportType, setReportType] = useState("members");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    generateReport();
  }, [reportType]);

  const generateReport = async () => {
    setLoading(true);
    try {
      let data = {};
      switch (reportType) {
        case "members":
          const membersRes = await fetch("http://localhost:5053/api/Members");
          data.members = await membersRes.json();
          break;
        case "attendance":
          const attendanceRes = await fetch(`http://localhost:5053/api/Attendance/date/${dateRange.end}`);
          data.attendance = await attendanceRes.json();
          break;
        case "payments":
          const paymentsRes = await fetch("http://localhost:5053/api/Payment");
          data.payments = await paymentsRes.json();
          break;
        case "revenue":
          const revenueRes = await fetch("http://localhost:5053/api/Dashboard/stats");
          data.revenue = await revenueRes.json();
          break;
        default:
          break;
      }
      setReportData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error generating report:", error);
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!reportData || !reportData.members) return;
    let csv = "ID,Name,Phone,Plan,Status\n";
    reportData.members.forEach(m => {
      csv += `${m.memberId},${m.name},${m.phone},${m.membershipPlan?.name || "Basic"},${m.status || "Active"}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${reportType}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>📊 Reports & Analytics</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e9edf4", marginBottom: "24px", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7a8d", textTransform: "uppercase" }}>Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={{ padding: "8px 12px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px", minWidth: "150px" }}>
            <option value="members">Members Report</option>
            <option value="attendance">Attendance Report</option>
            <option value="payments">Payments Report</option>
            <option value="revenue">Revenue Report</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7a8d", textTransform: "uppercase" }}>Start Date</label>
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} style={{ padding: "8px 12px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "#6b7a8d", textTransform: "uppercase" }}>End Date</label>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} style={{ padding: "8px 12px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px" }} />
        </div>

        <button onClick={generateReport} style={{ padding: "10px 24px", background: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500", height: "42px" }}>
          🔄 Generate Report
        </button>

        <button onClick={exportCSV} style={{ padding: "10px 20px", background: "#2196F3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "500", height: "42px", marginLeft: "auto" }}>
          📄 Export CSV
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7a8d" }}>Generating report...</div>
      ) : (
        <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e9edf4" }}>
          {reportType === "members" && reportData?.members && (
            <div style={{ overflowX: "auto" }}>
              <h3 style={{ marginBottom: "12px", color: "#2c3e50" }}>Members Report</h3>
              <p style={{ marginBottom: "12px" }}>Total Members: {reportData.members.length}</p>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8f9fa" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #e9edf4" }}>ID</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #e9edf4" }}>Name</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #e9edf4" }}>Phone</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #e9edf4" }}>Plan</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #e9edf4" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.members.map(m => (
                    <tr key={m.memberId}>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #eef2f7" }}>#{m.memberId}</td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #eef2f7" }}>{m.name}</td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #eef2f7" }}>{m.phone}</td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #eef2f7" }}>{m.membershipPlan?.name || "Basic"}</td>
                      <td style={{ padding: "10px 16px", borderBottom: "1px solid #eef2f7" }}>{m.status || "Active"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {reportType === "revenue" && reportData?.revenue && (
            <div>
              <h3 style={{ marginBottom: "16px", color: "#2c3e50" }}>Revenue Report</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#6b7a8d", fontSize: "14px" }}>Total Revenue</h4>
                  <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#2c3e50" }}>${reportData.revenue.revenue || 0}</p>
                </div>
                <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#6b7a8d", fontSize: "14px" }}>Total Members</h4>
                  <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#2c3e50" }}>{reportData.revenue.totalMembers || 0}</p>
                </div>
                <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#6b7a8d", fontSize: "14px" }}>Active Members</h4>
                  <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#2c3e50" }}>{reportData.revenue.activeMembers || 0}</p>
                </div>
                <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
                  <h4 style={{ margin: "0 0 8px 0", color: "#6b7a8d", fontSize: "14px" }}>Premium Members</h4>
                  <p style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: "#2c3e50" }}>{reportData.revenue.premiumMembers || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
