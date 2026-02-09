import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCodePromoById, updateCodePromo } from "../../services/codepromos";

export default function CodePromoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    remise: "",
    actif: true,
  });

  useEffect(() => {
    loadCodePromo();
  }, [id]);

  async function loadCodePromo() {
    try {
      setLoading(true);
      const response = await getCodePromoById(id);
      const codePromo = response.data;
      setFormData({
        code: codePromo.code,
        remise: (codePromo.remise * 100).toFixed(2), // Convertir 0.4 -> 40
        actif: codePromo.actif,
      });
    } catch (error) {
      console.error("Erreur chargement code promo:", error);
      alert("Erreur lors du chargement du code promo");
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
      // Convertir la remise en décimal (ex: 40 -> 0.4)
      const dataToSend = {
        code: formData.code,
        remise: parseFloat(formData.remise) / 100,
        actif: formData.actif,
      };
      await updateCodePromo(id, dataToSend);
      navigate("/codepromos");
    } catch (error) {
      console.error("Erreur modification code promo:", error);
      alert("Erreur lors de la modification du code promo");
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
          <h1 style={styles.title}>✏️ Modifier le code promo</h1>
          <p style={styles.subtitle}>Mettez à jour les informations du code promo</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Code promo *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Ex: PROMO-1234"
            />
            <p style={styles.helper}>Le code que les clients utiliseront</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Remise (%) *</label>
            <input
              type="number"
              name="remise"
              value={formData.remise}
              onChange={handleChange}
              required
              min="0"
              max="100"
              step="0.01"
              style={styles.input}
              placeholder="Ex: 40"
            />
            <p style={styles.helper}>Pourcentage de remise (0 à 100)</p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="actif"
                checked={formData.actif}
                onChange={(e) => setFormData(prev => ({ ...prev, actif: e.target.checked }))}
                style={styles.checkbox}
              />
              <span>Code promo actif</span>
            </label>
            <p style={styles.helper}>Seuls les codes actifs peuvent être utilisés</p>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate("/codepromos")}
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
  helper: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem',
    marginBottom: 0,
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    width: '1.25rem',
    height: '1.25rem',
    cursor: 'pointer',
  },
};
