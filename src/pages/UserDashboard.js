import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { removeToken } from "../utils/token";

function UserDashboard({ darkMode }) {
  const navigate = useNavigate();

  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [fullName, setFullName] = useState("");

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAccount, setTransferAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const detailsRes = await api.get("/api/account/details");
      const txnRes = await api.get("/api/account/transactions");

      setAccountNumber(detailsRes.data.accountNumber);
      setBalance(detailsRes.data.balance);
      setFullName(detailsRes.data.fullName); // 👈 username added
      setTransactions(txnRes.data);
    } catch (error) {
      alert("Session expired. Please login again.");
      removeToken();
      navigate("/login");
    }
  };

  const handleDeposit = async () => {
    const amount = Number(depositAmount);
    if (!amount || amount <= 0) return alert("Enter valid deposit amount");

    try {
      await api.post("/api/account/deposit", { amount });
      setDepositAmount("");
      fetchAccountData();
    } catch (error) {
      alert(error.response?.data?.message || "Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) return alert("Enter valid withdrawal amount");

    try {
      await api.post("/api/account/withdraw", { amount });
      setWithdrawAmount("");
      fetchAccountData();
    } catch (error) {
      alert(error.response?.data?.message || "Withdraw failed");
    }
  };

  const handleTransfer = async () => {
    const trimmedAccount = transferAccount.trim();
    const amount = Number(transferAmount);

    if (!trimmedAccount) return alert("Enter receiver account number");
    if (!amount || amount <= 0) return alert("Enter valid transfer amount");

    try {
      await api.post("/api/account/transfer", {
        toAccountNumber: trimmedAccount,
        amount
      });

      setTransferAccount("");
      setTransferAmount("");
      fetchAccountData();
    } catch (error) {
      alert(error.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <div
      style={{
        ...styles.wrapper,
        backgroundColor: darkMode ? "#111827" : "#f9fafb",
        color: darkMode ? "#f3f4f6" : "#111827",
        transition: "all 0.3s ease"
      }}
    >
      {/* 👤 Welcome Section */}
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ margin: 0 }}>
          Welcome back, {fullName}
        </h2>
        <p style={{ opacity: 0.7 }}>
          Here’s your account overview
        </p>
      </div>

      {/* Balance Card */}
      <div style={styles.balanceCard}>
        <div>
          <p style={styles.label}>Account Number</p>
          <h3>{accountNumber}</h3>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={styles.label}>Available Balance</p>
          <h1 style={styles.balance}>₹ {balance}</h1>
        </div>
      </div>

      <h3 style={styles.sectionTitle}>Quick Actions</h3>

      <div style={styles.grid}>
        {/* Deposit */}
        <div
          style={{
            ...styles.card,
            backgroundColor: darkMode ? "#1f2937" : "#ffffff"
          }}
        >
          <h3>Deposit</h3>
          <input
            type="number"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            style={styles.input}
          />
          <button style={styles.successBtn} onClick={handleDeposit}>
            Deposit Money
          </button>
        </div>

        {/* Withdraw */}
        <div
          style={{
            ...styles.card,
            backgroundColor: darkMode ? "#1f2937" : "#ffffff"
          }}
        >
          <h3>Withdraw</h3>
          <input
            type="number"
            placeholder="Enter amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            style={styles.input}
          />
          <button style={styles.dangerBtn} onClick={handleWithdraw}>
            Withdraw Money
          </button>
        </div>

        {/* Transfer */}
        <div
          style={{
            ...styles.card,
            backgroundColor: darkMode ? "#1f2937" : "#ffffff"
          }}
        >
          <h3>Transfer</h3>
          <input
            type="text"
            placeholder="Receiver Account Number"
            value={transferAccount}
            onChange={(e) => setTransferAccount(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Enter amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            style={styles.input}
          />
          <button style={styles.primaryBtn} onClick={handleTransfer}>
            Send Money
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div
        style={{
          ...styles.transactionsCard,
          backgroundColor: darkMode ? "#1f2937" : "#ffffff"
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Recent Transactions</h3>

        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr
                style={{
                  backgroundColor: darkMode ? "#374151" : "#f3f4f6"
                }}
              >
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Balance After</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={styles.tableRow}>
                  <td style={styles.td}>{tx.type}</td>
                  <td style={styles.td}>₹ {tx.amount}</td>
                  <td style={styles.td}>₹ {tx.balanceAfter}</td>
                  <td style={styles.td}>
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "20px",
    minHeight: "80vh"
  },
  balanceCard: {
    background: "linear-gradient(135deg, #1e40af, #2563eb)",
    color: "white",
    padding: "30px",
    borderRadius: "14px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "40px"
  },
  label: {
    opacity: 0.8,
    fontSize: "14px"
  },
  balance: {
    fontSize: "36px",
    marginTop: "5px"
  },
  sectionTitle: {
    marginBottom: "15px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  card: {
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  primaryBtn: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  successBtn: {
    width: "100%",
    padding: "10px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  dangerBtn: {
    width: "100%",
    padding: "10px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  transactionsCard: {
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    padding: "12px",
    textAlign: "left"
  },
  td: {
    padding: "12px"
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb"
  }
};

export default UserDashboard;