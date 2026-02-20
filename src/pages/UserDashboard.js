import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { removeToken } from "../utils/token";

function UserDashboard() {
  const navigate = useNavigate();

  // Account Info
  const [accountNumber, setAccountNumber] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // Form States
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [transferAccount, setTransferAccount] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  useEffect(() => {
    fetchAccountData();
  }, []);

  // 🔹 Fetch Account Details + Transactions
  const fetchAccountData = async () => {
    try {
      const detailsRes = await api.get("/api/account/details");
      const txnRes = await api.get("/api/account/transactions");

      setAccountNumber(detailsRes.data.accountNumber);
      setBalance(detailsRes.data.balance);
      setTransactions(txnRes.data);

    } catch (error) {
      console.error("Fetch error:", error);
      alert("Session expired. Please login again.");
      removeToken();
      navigate("/login");
    }
  };

  // 🔹 Deposit
  const handleDeposit = async () => {
    const amount = Number(depositAmount);

    if (!amount || amount <= 0) {
      alert("Enter valid deposit amount");
      return;
    }

    try {
      await api.post("/api/account/deposit", { amount });

      alert("Deposit successful");
      setDepositAmount("");
      fetchAccountData();

    } catch (error) {
      console.log("Deposit error:", error.response);
      alert(error.response?.data?.message || "Deposit failed");
    }
  };

  // 🔹 Withdraw
  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);

    if (!amount || amount <= 0) {
      alert("Enter valid withdrawal amount");
      return;
    }

    try {
      await api.post("/api/account/withdraw", { amount });

      alert("Withdrawal successful");
      setWithdrawAmount("");
      fetchAccountData();

    } catch (error) {
      console.log("Withdraw error:", error.response);
      alert(error.response?.data?.message || "Withdraw failed");
    }
  };

  // 🔹 Transfer
  const handleTransfer = async () => {
    const trimmedAccount = transferAccount.trim();
    const amount = Number(transferAmount);

    if (!trimmedAccount) {
      alert("Enter receiver account number");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Enter valid transfer amount");
      return;
    }

    try {
      await api.post("/api/account/transfer", {
        toAccountNumber: trimmedAccount,
        amount: amount
      });

      alert("Transfer successful");
      setTransferAccount("");
      setTransferAmount("");
      fetchAccountData();

    } catch (error) {
      console.log("Transfer error:", error.response);
      alert(error.response?.data?.message || "Transfer failed");
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Dashboard</h2>

      <p><strong>Account Number:</strong> {accountNumber}</p>
      <p><strong>Balance:</strong> ₹ {balance}</p>

      <hr />

      {/* Deposit */}
      <h3>Deposit</h3>
      <input
        type="number"
        placeholder="Amount"
        value={depositAmount}
        onChange={(e) => setDepositAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>

      <hr />

      {/* Withdraw */}
      <h3>Withdraw</h3>
      <input
        type="number"
        placeholder="Amount"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />
      <button onClick={handleWithdraw}>Withdraw</button>

      <hr />

      {/* Transfer */}
      <h3>Transfer</h3>
      <input
        type="text"
        placeholder="Receiver Account Number"
        value={transferAccount}
        onChange={(e) => setTransferAccount(e.target.value)}
      />
      <br /><br />
      <input
        type="number"
        placeholder="Amount"
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Transfer</button>

      <hr />

      {/* Transactions */}
      <h3>Transactions</h3>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <ul>
          {transactions.map((txn) => (
            <li key={txn.id}>
              <strong>{txn.type}</strong> — ₹ {txn.amount}
              <br />
              Balance After: ₹ {txn.balanceAfter}
              <br />
              {txn.description}
              <br />
              {txn.createdAt}
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

export default UserDashboard;