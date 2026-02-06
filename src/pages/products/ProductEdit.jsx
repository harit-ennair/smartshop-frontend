import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/products";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prixUnitaire: "",
    stockDisponible: "",
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      const response = await getProductById(id);
      const product = response.data.data || response.data;
      setFormData({
        nom: product.nom,
        prixUnitaire: product.prixUnitaire,
        stockDisponible: product.stockDisponible,
      });
    } catch (error) {
      console.error("Erreur chargement produit:", error);
      alert("Erreur lors du chargement du produit");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProduct(id, formData);
      navigate("/products");
    } catch (error) {
      console.error("Erreur modification produit:", error);
      alert("Erreur lors de la modification du produit");
    } finally {
      setSaving(false);
    }
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
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>✏️ Modifier le produit</h1>
          <p style={styles.subtitle}>Mettez à jour les informations du produit</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom du produit *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ex: iPhone 13 Pro"
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Prix unitaire (DH) *</label>
              <input
                type="number"
                name="prixUnitaire"
                value={formData.prixUnitaire}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                style={styles.input}
                placeholder="0.00"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Stock disponible *</label>
              <input
                type="number"
                name="stockDisponible"
                value={formData.stockDisponible}
                onChange={handleChange}
                required
                min="0"
                style={styles.input}
                placeholder="0"
              />
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate("/products")}
              style={styles.cancelButton}
              disabled={saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={saving}
            >
              {saving ? "Enregistrement..." : "✓ Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    overflow: 'hidden',
  },
  header: {
    padding: '2rem',
    borderBottom: '2px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
  form: {
    padding: '2rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
    flex: 1,
  },
  formRow: {
    display: 'flex',
    gap: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '6px',
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
};