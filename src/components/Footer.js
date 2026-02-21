import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        <div>
          <h3 style={styles.logo}>NeoBank</h3>
          <p style={styles.tagline}>
            Modern Banking. Secure. Simple. Smart.
          </p>
        </div>

        <div style={styles.links}>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>Support</p>
        </div>

      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} NeoBank. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "60px",
    backgroundColor: "#111827",
    color: "#e5e7eb",
    paddingTop: "30px"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  logo: {
    color: "white",
    marginBottom: "10px"
  },
  tagline: {
    fontSize: "14px",
    opacity: 0.7
  },
  links: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
    cursor: "pointer"
  },
  bottom: {
    textAlign: "center",
    padding: "15px",
    marginTop: "20px",
    borderTop: "1px solid #374151",
    fontSize: "13px",
    opacity: 0.7
  }
};

export default Footer;