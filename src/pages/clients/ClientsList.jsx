import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClients } from "../../services/clients";

export default function ClientsList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response.data.data || response.data); 
    } catch (error) {
      console.error("Erreur chargement clients:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Liste des clients</h1>
          <p style={styles.subtitle}>{clients.length} client{clients.length > 1 ? 's' : ''} au total</p>
        </div>
        <button 
          onClick={() => navigate('/clients/new')}
          style={styles.addButton}
        >
          <span style={styles.addIcon}>➕</span>
          <span>Nouveau Client</span>
        </button>
      </div>

      {clients.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>👥</div>
          <h3 style={styles.emptyTitle}>Aucun client trouvé</h3>
          <p style={styles.emptyText}>Commencez par créer votre premier client</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>UserName</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Niveau Fidélité</th>
                <th style={styles.th}>Total Commandes</th>
                <th style={styles.th}>Total Dépensé</th>
                <th style={{...styles.th, textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((c, index) => (
                <tr key={c.id} style={{
                  ...styles.row,
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}>
                  <td style={styles.td}>{c.nom}</td>
                  <td style={styles.td}>{c.username}</td>
                  <td style={styles.td}>{c.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: c.niveauFidelite === 'GOLD' ? '#fbbf24' : 
                                     c.niveauFidelite === 'SILVER' ? '#9ca3af' : 
                                     c.niveauFidelite === 'BRONZE' ? '#cd7f32' : '#3b82f6'
                    }}>
                      {c.niveauFidelite || 'STANDARD'}
                    </span>
                  </td>
                  <td style={styles.td}>{c.totalOrders || 0}</td>
                  <td style={styles.td}>{c.totalSpent ? `${parseFloat(c.totalSpent).toFixed(2)} DH` : '0.00 DH'}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <button 
                      onClick={() => navigate(`/clients/${c.id}/edit`)}
                      style={styles.editButton}
                      title="Modifier"
                    >
                      ✏️ Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    marginBottom: '2rem',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#f3f4f6',
    borderBottom: '2px solid #e5e7eb',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  row: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
  },
  td: {
    padding: '1rem',
    fontSize: '0.95rem',
    color: '#111827',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
  },
  spinner: {
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    color: '#6b7280',
    fontSize: '1rem',
  },
  editButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginRight: '0.5rem',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '4rem 2rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 0.5rem 0',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  addIcon: {
    fontSize: '1rem',
  },
};
