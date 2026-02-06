import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <h2 style={styles.brandText}>SmartShop</h2>
        </div>

        <div style={styles.links}>
          <Link 
            to="/products" 
            style={{
              ...styles.link,
              ...(isActive('/products') ? styles.linkActive : {})
            }}
          >
            📦 Produits
          </Link>

          <Link 
            to="/products/new"
            style={styles.buttonLink}
          >
            ➕ Nouveau Produit
          </Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#1f2937',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '64px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  brandText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: '#d1d5db',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  linkActive: {
    backgroundColor: '#374151',
    color: '#ffffff',
  },
  buttonLink: {
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
};