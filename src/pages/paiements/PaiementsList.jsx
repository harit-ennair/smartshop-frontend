import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCommandes } from "../../services/commandes";

export default function PaiementsList() {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommandesEnAttente();
  }, []);

  async function loadCommandesEnAttente() {
    try {
      setLoading(true);
      const response = await getCommandes();
      const data = response.data.data || response.data;
      
      // Filtrer les commandes en attente avec un montant restant > 0
      const commandesEnAttente = data.filter(
        c => c.statut === 'PENDING' && parseFloat(c.montantRestant || 0) > 0
      );
      
      setCommandes(commandesEnAttente);
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
    } finally {
      setLoading(false);
    }
  }

  function handlePayment(commandeId) {
    navigate(`/paiements/new?commandeId=${commandeId}`);
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
          <h1 style={styles.title}>Commandes en attente de paiement</h1>
          <p style={styles.subtitle}>
            {commandes.length} commande{commandes.length > 1 ? 's' : ''} à payer
          </p>
        </div>
      </div>

      {commandes.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💳</div>
          <h3 style={styles.emptyTitle}>Aucune commande en attente</h3>
          <p style={styles.emptyText}>
            Toutes les commandes sont payées ou il n'y a pas de commandes actives
          </p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Commande</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Articles</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Montant Total</th>
                <th style={styles.th}>Montant Payé</th>
                <th style={styles.th}>Reste à Payer</th>
                <th style={{...styles.th, textAlign: 'center'}}>Action</th>
              </tr>
            </thead>

            <tbody>
              {commandes.map((c, index) => {
                const montantPaye = parseFloat(c.total || 0) - parseFloat(c.montantRestant || 0);
                
                return (
                  <tr 
                    key={c.id} 
                    style={{
                      ...styles.row,
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                    }}
                  >
                    <td style={styles.td}>
                      <span style={styles.commandeId}>#{c.id}</span>
                    </td>
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
                    <td style={{...styles.td, fontWeight: '700', color: '#111827'}}>
                      {c.total ? `${parseFloat(c.total).toFixed(2)} DH` : '0.00 DH'}
                    </td>
                    <td style={{...styles.td, color: '#10b981', fontWeight: '600'}}>
                      {montantPaye.toFixed(2)} DH
                    </td>
                    <td style={{...styles.td, fontWeight: '700', color: '#ef4444', fontSize: '1.1rem'}}>
                      {c.montantRestant ? `${parseFloat(c.montantRestant).toFixed(2)} DH` : '0.00 DH'}
                    </td>
                    <td style={{...styles.td, textAlign: 'center'}}>
                      <button 
                        onClick={() => handlePayment(c.id)}
                        style={styles.payButton}
                        title="Effectuer un paiement"
                      >
                        💳 Payer
                      </button>
                    </td>
                  </tr>
                );
              })}
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
  payButton: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
  commandeId: {
    fontWeight: '700',
    color: '#3b82f6',
    fontSize: '1rem',
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
};
