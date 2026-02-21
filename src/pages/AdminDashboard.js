import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { removeToken } from "../utils/token";

function AdminDashboard({ darkMode }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const usersRes = await api.get("/api/admin/users");
      const accountsRes = await api.get("/api/admin/accounts");
      const txnRes = await api.get("/api/admin/transactions");

      setUsers(usersRes.data);
      setAccounts(accountsRes.data);
      setTransactions(txnRes.data);
    } catch (error) {
      alert("Admin session expired or unauthorized.");
      removeToken();
      navigate("/login");
    }
  };

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );

  return (
    <div
      style={{
        ...styles.page,
        backgroundColor: darkMode ? "#111827" : "#f9fafb",
        color: darkMode ? "#f3f4f6" : "#111827",
        transition: "all 0.3s ease"
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>Admin Control Panel</h2>
        <p style={styles.subtext}>System Overview & Management</p>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {[
          { label: "Total Users", value: users.length },
          { label: "Total Accounts", value: accounts.length },
          { label: "Total Bank Balance", value: `₹ ${totalBalance}` },
          { label: "Total Transactions", value: transactions.length }
        ].map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.summaryCard,
              backgroundColor: darkMode ? "#1f2937" : "#ffffff"
            }}
          >
            <p style={{ opacity: 0.7 }}>{item.label}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Users */}
      <div
        style={{
          ...styles.section,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff"
        }}
      >
        <h3>All Users</h3>
        <table style={styles.table}>
          <thead>
            <tr
              style={{
                backgroundColor: darkMode ? "#374151" : "#f3f4f6"
              }}
            >
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={styles.row}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.fullName}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Accounts */}
      <div
        style={{
          ...styles.section,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff"
        }}
      >
        <h3>All Accounts</h3>
        <table style={styles.table}>
          <thead>
            <tr
              style={{
                backgroundColor: darkMode ? "#374151" : "#f3f4f6"
              }}
            >
              <th style={styles.th}>Account Number</th>
              <th style={styles.th}>Owner</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account.accountNumber} style={styles.row}>
                <td style={styles.td}>{account.accountNumber}</td>
                <td style={styles.td}>{account.fullName}</td>
                <td style={styles.td}>{account.email}</td>
                <td style={styles.td}>₹ {account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transactions */}
      <div
        style={{
          ...styles.section,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff"
        }}
      >
        <h3>All Transactions</h3>
        <table style={styles.table}>
          <thead>
            <tr
              style={{
                backgroundColor: darkMode ? "#374151" : "#f3f4f6"
              }}
            >
              <th style={styles.th}>Account</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Balance After</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} style={styles.row}>
                <td style={styles.td}>{tx.accountNumber}</td>
                <td style={styles.td}>{tx.type}</td>
                <td style={styles.td}>₹ {tx.amount}</td>
                <td style={styles.td}>₹ {tx.balanceAfter}</td>
                <td style={styles.td}>{tx.description}</td>
                <td style={styles.td}>
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "20px",
    minHeight: "80vh",
    fontFamily: "Segoe UI, sans-serif"
  },
  header: {
    marginBottom: "30px"
  },
  subtext: {
    marginTop: "5px",
    opacity: 0.6
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  summaryCard: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    textAlign: "center"
  },
  section: {
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    marginBottom: "30px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px"
  },
  th: {
    padding: "12px",
    textAlign: "left"
  },
  td: {
    padding: "12px"
  },
  row: {
    borderBottom: "1px solid #e5e7eb"
  }
};

export default AdminDashboard;