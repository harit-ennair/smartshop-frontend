import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/products";

export default function ProductNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prixUnitaire: "",
    stockDisponible: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createProduct(formData);
      navigate("/products");
    } catch (error) {
      console.error("Erreur création produit:", error);
      alert("Erreur lors de la création du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>➕ Créer un nouveau produit</h1>
          <p style={styles.subtitle}>Remplissez le formulaire ci-dessous pour ajouter un produit</p>
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
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Création..." : "✓ Créer le produit"}
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
};
