import React, { useState, useEffect } from "react";

const Attendance = () => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadMembers();
    loadAttendance();
  }, [selectedDate]);

  const loadMembers = async () => {
    try {
      const response = await fetch("http://localhost:5053/api/Members");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error loading members:", error);
    }
  };

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5053/api/Attendance/date/${selectedDate}`);
      const data = await response.json();
      setAttendance(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading attendance:", error);
      setLoading(false);
    }
  };

  const handleCheckIn = async (memberId) => {
    try {
      const response = await fetch("http://localhost:5053/api/Attendance/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, date: selectedDate })
      });
      if (response.ok) {
        showMessage("success", "✅ Check-in successful!");
        loadAttendance();
      }
    } catch (error) {
      showMessage("error", "❌ Check-in failed");
    }
  };

  const handleCheckOut = async (memberId) => {
    try {
      const response = await fetch("http://localhost:5053/api/Attendance/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, date: selectedDate })
      });
      if (response.ok) {
        showMessage("success", "✅ Check-out successful!");
        loadAttendance();
      }
    } catch (error) {
      showMessage("error", "❌ Check-out failed");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const filteredMembers = members.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone?.includes(searchTerm)
  );

  const isCheckedIn = (memberId) => {
    return attendance.some(a => a.memberId === memberId && !a.checkoutTime);
  };

  const isCheckedOut = (memberId) => {
    return attendance.some(a => a.memberId === memberId && a.checkoutTime);
  };

  const getTodayStats = () => {
    const checkedIn = attendance.filter(a => !a.checkoutTime).length;
    const checkedOut = attendance.filter(a => a.checkoutTime).length;
    const total = members.length;
    return { checkedIn, checkedOut, total };
  };

  const stats = getTodayStats();

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ margin: 0, color: "#2c3e50" }}>📋 Attendance Tracking</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: "10px 14px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "14px" }}
          />
          <span style={{ background: "#f0f2f5", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500" }}>
            📊 {stats.checkedIn} Checked In | {stats.checkedOut} Checked Out | {stats.total} Total
          </span>
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontWeight: "500",
          background: message.type === "success" ? "#e8f5e9" : "#ffebee",
          color: message.type === "success" ? "#2e7d32" : "#c62828",
          border: message.type === "success" ? "1px solid #c8e6c9" : "1px solid #ffcdd2"
        }}>
          {message.text}
        </div>
      )}

      <div style={{ position: "relative", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search member by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "12px 16px", border: "2px solid #e9edf4", borderRadius: "8px", fontSize: "15px" }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7a8d" }}>Loading attendance...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {filteredMembers.map(member => {
            const checkedIn = isCheckedIn(member.memberId);
            const checkedOut = isCheckedOut(member.memberId);
            const isPresent = checkedIn || checkedOut;

            return (
              <div key={member.memberId} style={{
                background: "white",
                borderRadius: "12px",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                border: checkedIn ? "1px solid #4CAF50" : "1px solid #e9edf4",
                borderLeft: checkedIn ? "4px solid #4CAF50" : "4px solid transparent"
              }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#4CAF50", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "600" }}>
                  {member.name?.charAt(0) || "?"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "16px" }}>{member.name}</div>
                  <div style={{ fontSize: "13px", color: "#6b7a8d" }}>📞 {member.phone}</div>
                  <div style={{ marginTop: "4px" }}>
                    {checkedIn && <span style={{ padding: "2px 10px", borderRadius: "12px", fontSize: "12px", background: "#e8f5e9", color: "#2e7d32" }}>✅ Checked In</span>}
                    {checkedOut && <span style={{ padding: "2px 10px", borderRadius: "12px", fontSize: "12px", background: "#fff3e0", color: "#e65100" }}>⏰ Checked Out</span>}
                    {!isPresent && <span style={{ padding: "2px 10px", borderRadius: "12px", fontSize: "12px", background: "#ffebee", color: "#c62828" }}>❌ Absent</span>}
                  </div>
                </div>
                <div>
                  {!checkedIn && !checkedOut && (
                    <button onClick={() => handleCheckIn(member.memberId)} style={{ padding: "8px 16px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>
                      Check In
                    </button>
                  )}
                  {checkedIn && (
                    <button onClick={() => handleCheckOut(member.memberId)} style={{ padding: "8px 16px", background: "#ff9800", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}>
                      Check Out
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Attendance;
