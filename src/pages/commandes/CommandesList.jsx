import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCommandes, cancelCommande } from "../../services/commandes";

export default function CommandesList() {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommandes();
  }, []);

  async function loadCommandes() {
    try {
      setLoading(true);
      const response = await getCommandes();
      setCommandes(response.data.data || response.data);
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      try {
        await cancelCommande(id);
        alert("Commande annulée avec succès");
        loadCommandes();
      } catch (error) {
        console.error("Erreur annulation commande:", error);
        alert("Erreur lors de l'annulation de la commande");
      }
    }
  }

  const getStatusBadge = (statut) => {
    const statusConfig = {
      PENDING: { label: 'En attente', color: '#f59e0b' },
      CONFIRMED: { label: 'Confirmée', color: '#10b981' },
      CANCELLED: { label: 'Annulée', color: '#ef4444' }
    };
    const config = statusConfig[statut] || { label: statut, color: '#6b7280' };
    return (
      <span style={{ 
        ...styles.badge, 
        backgroundColor: config.color 
      }}>
        {config.label}
      </span>
    );
  };

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
          <h1 style={styles.title}>Liste des commandes</h1>
          <p style={styles.subtitle}>{commandes.length} commande{commandes.length > 1 ? 's' : ''} au total</p>
        </div>
        <button 
          onClick={() => navigate('/commandes/new')}
          style={styles.addButton}
        >
          <span style={styles.addIcon}>➕</span>
          <span>Nouvelle Commande</span>
        </button>
      </div>

      {commandes.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={styles.emptyTitle}>Aucune commande trouvée</h3>
          <p style={styles.emptyText}>Commencez par créer votre première commande</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Articles</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Sous-total</th>
                <th style={styles.th}>Remise</th>
                <th style={styles.th}>TVA</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Code Promo</th>
                <th style={styles.th}>Restant</th>
                <th style={styles.th}>Statut</th>
                <th style={{...styles.th, textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {commandes.map((c, index) => (
                <tr key={c.id} style={{
                  ...styles.row,
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}>
                  <td style={styles.td}>#{c.id}</td>
                  <td style={styles.td}>
                    <strong>{c.clientNom || '-'}</strong>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.articlesList}>
                      {c.listeArticles && c.listeArticles.length > 0 ? (
                        c.listeArticles.map((article, idx) => (
                          <div key={idx} style={styles.articleItem}>
                            <span style={styles.articleName}>{article.produitNom}</span>
                            <span style={styles.articleQty}>×{article.quantite}</span>
                          </div>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>
                  <td style={styles.td}>
                    {c.date ? new Date(c.date).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : '-'}
                  </td>
                  <td style={styles.td}>{c.sousTotal ? `${parseFloat(c.sousTotal).toFixed(2)} DH` : '0.00 DH'}</td>
                  <td style={{...styles.td, color: '#ef4444', fontWeight: '600'}}>
                    -{c.remise ? `${parseFloat(c.remise).toFixed(2)} DH` : '0.00 DH'}
                  </td>
                  <td style={styles.td}>{c.tva ? `${parseFloat(c.tva).toFixed(2)} DH` : '0.00 DH'}</td>
                  <td style={{...styles.td, fontWeight: '700', color: '#111827'}}>
                    {c.total ? `${parseFloat(c.total).toFixed(2)} DH` : '0.00 DH'}
                  </td>
                  <td style={styles.td}>
                    {c.codePromoCode ? (
                      <span style={styles.promoBadge}>{c.codePromoCode}</span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>-</span>
                    )}
                  </td>
                  <td style={{
                    ...styles.td, 
                    fontWeight: '600',
                    color: c.montantRestant === 0 ? '#10b981' : '#f59e0b'
                  }}>
                    {c.montantRestant !== undefined ? `${parseFloat(c.montantRestant).toFixed(2)} DH` : '-'}
                  </td>
                  <td style={styles.td}>{getStatusBadge(c.statut)}</td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    {c.statut === 'PENDING' && (
                      <div style={styles.actionButtons}>
                        <button 
                          onClick={() => handleCancel(c.id)}
                          style={styles.cancelButton}
                          title="Annuler la commande"
                        >
                          ✕ Annuler
                        </button>
                      </div>
                    )}
                    {c.statut !== 'PENDING' && (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                        {c.statut === 'CONFIRMED' ? '✓ Confirmée' : '✕ Annulée'}
                      </span>
                    )}
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
    maxWidth: '1400px',
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
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    display: 'inline-block',
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
  cancelButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginLeft: '0.5rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  articlesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  articleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
  },
  articleName: {
    color: '#374151',
  },
  articleQty: {
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '0.125rem 0.5rem',
    borderRadius: '4px',
  },
  promoBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#d1fae5',
    display: 'inline-block',
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
