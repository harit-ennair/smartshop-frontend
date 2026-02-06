import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../../services/products";

export default function ProductsList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response.data.data || response.data); 
    } catch (error) {
      console.error("Erreur chargement produits:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, nom) {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${nom}" ?`)) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error("Erreur suppression produit:", error);
        alert("Erreur lors de la suppression du produit");
      }
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
        <h1 style={styles.title}>Liste des produits</h1>
        <p style={styles.subtitle}>{products.length} produit{products.length > 1 ? 's' : ''} au total</p>
      </div>

      {products.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📦</div>
          <h3 style={styles.emptyTitle}>Aucun produit trouvé</h3>
          <p style={styles.emptyText}>Commencez par créer votre premier produit</p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Prix HT</th>
                <th style={styles.th}>Stock</th>
                <th style={{...styles.th, textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr key={p.id} style={{
                  ...styles.row,
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}>
                  <td style={styles.td}>{p.nom}</td>
                  <td style={styles.td}>{p.prixUnitaire} DH</td>
                  <td style={{
                    ...styles.td,
                    ...styles.stockCell,
                    color: p.stockDisponible > 10 ? '#059669' : p.stockDisponible > 0 ? '#d97706' : '#dc2626'
                  }}>
                    {p.stockDisponible}
                  </td>
                  <td style={{...styles.td, textAlign: 'center'}}>
                    <button 
                      onClick={() => navigate(`/products/${p.id}/edit`)}
                      style={styles.editButton}
                      title="Modifier"
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id, p.nom)}
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
  stockCell: {
    fontWeight: '600',
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
};