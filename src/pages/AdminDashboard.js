import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { removeToken } from "../utils/token";

function AdminDashboard() {
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
      console.error("Admin fetch error:", error.response);
      alert("Admin session expired or unauthorized.");
      removeToken();
      navigate("/login");
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <hr />

      {/* USERS */}
      <h3>All Users</h3>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.fullName} — {user.email} — {user.role}
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* ACCOUNTS */}
      <h3>All Accounts</h3>
      {accounts.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        <ul>
          {accounts.map(account => (
            <li key={account.accountNumber}>
              {account.accountNumber} — ₹ {account.balance}
              <br />
              Owner: {account.fullName} ({account.email})
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* TRANSACTIONS */}
      <h3>All Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <ul>
          {transactions.map(tx => (
            <li key={tx.id}>
              Account: {tx.accountNumber}
              <br />
              {tx.type} — ₹ {tx.amount}
              <br />
              Balance After: ₹ {tx.balanceAfter}
              <br />
              {tx.description}
              <br />
              {tx.createdAt}
              <hr />
            </li>
          ))}
        </ul>
      )}

      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AdminDashboard;