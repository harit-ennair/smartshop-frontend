import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>
        <h2 style={styles.brandText}>🛒 SmartShop</h2>
      </div>

      <nav style={styles.nav}>
        <div style={styles.linksGroup}>
          <h3 style={styles.groupTitle}>Menu Principal</h3>
          <Link 
            to="/products" 
            style={{
              ...styles.link,
              ...(isActive('/products') ? styles.linkActive : {})
            }}
          >
            <span style={styles.icon}>📦</span>
            <span>Produits</span>
          </Link>

          <Link 
            to="/clients" 
            style={{
              ...styles.link,
              ...(isActive('/clients') ? styles.linkActive : {})
            }}
          >
            <span style={styles.icon}>👥</span>
            <span>Clients</span>
          </Link>

          <Link 
            to="/commandes" 
            style={{
              ...styles.link,
              ...(isActive('/commandes') ? styles.linkActive : {})
            }}
          >
            <span style={styles.icon}>📋</span>
            <span>Commandes</span>
          </Link>

          <Link 
            to="/codepromos" 
            style={{
              ...styles.link,
              ...(isActive('/codepromos') ? styles.linkActive : {})
            }}
          >
            <span style={styles.icon}>🎟️</span>
            <span>Codes Promo</span>
          </Link>

          <Link 
            to="/paiements" 
            style={{
              ...styles.link,
              ...(isActive('/paiements') ? styles.linkActive : {})
            }}
          >
            <span style={styles.icon}>💳</span>
            <span>Paiements</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    backgroundColor: '#1f2937',
    width: '260px',
    minHeight: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
  },
  brand: {
    padding: '1.5rem 1.25rem',
    borderBottom: '1px solid #374151',
  },
  brandText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  nav: {
    padding: '1rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  linksGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    padding: '0 1rem',
  },
  groupTitle: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 0.5rem 0',
    padding: '0 0.5rem',
  },
  link: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  linkActive: {
    backgroundColor: '#374151',
    color: '#ffffff',
  },
  icon: {
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
  },
};