import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCodePromos, deleteCodePromo, changeCodePromoStatus } from "../../services/codepromos";

export default function CodePromosList() {
  const navigate = useNavigate();
  const [codePromos, setCodePromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCodePromos();
  }, []);

  async function loadCodePromos() {
    try {
      setLoading(true);
      const response = await getCodePromos();
      setCodePromos(response.data || []); 
    } catch (error) {
      console.error("Erreur chargement codes promo:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, code) {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${code}" ?`)) {
      try {
        await deleteCodePromo(id);
        loadCodePromos();
      } catch (error) {
        console.error("Erreur suppression code promo:", error);
        alert("Erreur lors de la suppression du code promo");
      }
    }
  }

  async function handleToggleStatus(id, currentStatus) {
    try {
      await changeCodePromoStatus(id, !currentStatus);
      loadCodePromos();
    } catch (error) {
      console.error("Erreur changement statut:", error);
      alert("Erreur lors du changement de statut");
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
          <h1 style={styles.title}>Liste des codes promo</h1>
          <p style={styles.subtitle}>{codePromos.length} code{codePromos.length > 1 ? 's' : ''} promo au total</p>
        </div>
        <button 
          onClick={() => navigate('/codepromos/new')}
          style={styles.addButton}
        >
          <span style={styles.addIcon}>➕</span>
          <span>Nouveau Code Promo</span>
        </button>
      </div>

      {codePromos.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🎟️</div>
          <h3 style={styles.emptyTitle}>Aucun code promo trouvé</h3>
          <p style={styles.emptyText}>Commencez par créer votre premier code promo</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Remise</th>
                <th style={styles.th}>Statut</th>
                <th style={{...styles.th, textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {codePromos.map((cp, index) => (
                <tr key={cp.id} style={{
                  ...styles.row,
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}>
                  <td style={styles.td}>
                    <span style={styles.codeText}>{cp.code}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.remiseText}>{(cp.remise * 100).toFixed(0)}%</span>
                  </td>
                  <td style={styles.td}>
                    <button
                      onClick={() => handleToggleStatus(cp.id, cp.actif)}
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: cp.actif ? '#d1fae5' : '#fee2e2',
                        color: cp.actif ? '#065f46' : '#991b1b',
                      }}
                    >
                      {cp.actif ? '✓ Actif' : '✕ Inactif'}
                    </button>
                  </td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <button 
                      onClick={() => navigate(`/codepromos/${cp.id}/edit`)}
                      style={styles.editButton}
                      title="Modifier"
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(cp.id, cp.code)}
                      style={styles.deleteButton}
                      title="Supprimer"
                    >
                      🗑️ Supprimer
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
  },
  td: {
    padding: '1rem',
    fontSize: '0.95rem',
    color: '#111827',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: '1rem',
    fontWeight: '600',
    backgroundColor: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
  },
  remiseText: {
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#059669',
  },
  statusBadge: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
  deleteButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
