import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCommande } from "../../services/commandes";
import { getClients } from "../../services/clients";
import { getProducts } from "../../services/products";
import { getCodePromos } from "../../services/codepromos";

export default function CommandeNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [codePromos, setCodePromos] = useState([]);
  const [formData, setFormData] = useState({
    clientId: "",
    listeArticles: [{ produitId: "", quantite: 1 }],
    codePromoId: null,
  });

  useEffect(() => {
    loadClientsAndProducts();
  }, []);

  async function loadClientsAndProducts() {
    try {
      const [clientsRes, productsRes, codePromosRes] = await Promise.all([
        getClients(),
        getProducts(),
        getCodePromos()
      ]);
      setClients(clientsRes.data.data || clientsRes.data);
      setProducts(productsRes.data.data || productsRes.data);
      setCodePromos(codePromosRes.data || []);
    } catch (error) {
      console.error("Erreur chargement données:", error);
      alert("Erreur lors du chargement des données");
    }
  }

  const handleClientChange = (e) => {
    setFormData(prev => ({ ...prev, clientId: parseInt(e.target.value) }));
  };

  const handleArticleChange = (index, field, value) => {
    const newArticles = [...formData.listeArticles];
    newArticles[index][field] = field === 'produitId' ? parseInt(value) : parseInt(value);
    setFormData(prev => ({ ...prev, listeArticles: newArticles }));
  };

  const addArticle = () => {
    setFormData(prev => ({
      ...prev,
      listeArticles: [...prev.listeArticles, { produitId: "", quantite: 1 }]
    }));
  };

  const removeArticle = (index) => {
    if (formData.listeArticles.length > 1) {
      const newArticles = formData.listeArticles.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, listeArticles: newArticles }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.clientId) {
      alert("Veuillez sélectionner un client");
      return;
    }
    
    const hasEmptyArticles = formData.listeArticles.some(
      article => !article.produitId || !article.quantite
    );
    
    if (hasEmptyArticles) {
      alert("Veuillez remplir tous les articles");
      return;
    }

    try {
      setLoading(true);
      await createCommande(formData);
      navigate("/commandes");
    } catch (error) {
      console.error("Erreur création commande:", error);
      alert("Erreur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>➕ Créer une nouvelle commande</h1>
          <p style={styles.subtitle}>Remplissez le formulaire ci-dessous pour créer une commande</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Client Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Client *</label>
            <select
              value={formData.clientId}
              onChange={handleClientChange}
              required
              style={styles.select}
            >
              <option value="">Sélectionner un client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.nom} - {client.email}
                </option>
              ))}
            </select>
          </div>

          {/* Articles Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Articles</h3>
              <button
                type="button"
                onClick={addArticle}
                style={styles.addArticleButton}
              >
                ➕ Ajouter un article
              </button>
            </div>

            {formData.listeArticles.map((article, index) => (
              <div key={index} style={styles.articleRow}>
                <div style={styles.articleFields}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Produit *</label>
                    <select
                      value={article.produitId}
                      onChange={(e) => handleArticleChange(index, 'produitId', e.target.value)}
                      required
                      style={styles.select}
                    >
                      <option value="">Sélectionner un produit</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.nom} - {product.prixUnitaire} DH (Stock: {product.stockDisponible})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Quantité *</label>
                    <input
                      type="number"
                      value={article.quantite}
                      onChange={(e) => handleArticleChange(index, 'quantite', e.target.value)}
                      required
                      min="1"
                      style={styles.input}
                      placeholder="1"
                    />
                  </div>
                </div>

                {formData.listeArticles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArticle(index)}
                    style={styles.removeButton}
                    title="Supprimer cet article"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Code Promo (Optional) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Code Promo (optionnel)</label>
            <select
              value={formData.codePromoId || ""}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                codePromoId: e.target.value ? parseInt(e.target.value) : null 
              }))}
              style={styles.select}
            >
              <option value="">Aucun code promo</option>
              {codePromos
                .filter(cp => cp.actif)
                .map(codePromo => (
                  <option key={codePromo.id} value={codePromo.id}>
                    {codePromo.code} - {(codePromo.remise * 100).toFixed(0)}% de remise
                  </option>
                ))}
            </select>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={() => navigate("/commandes")}
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
              {loading ? "Création..." : "✓ Créer la commande"}
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
    maxWidth: '900px',
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
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  section: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  addArticleButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  articleRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
  },
  articleFields: {
    display: 'flex',
    gap: '1rem',
    flex: 1,
  },
  removeButton: {
    padding: '0.5rem 1rem',
    fontSize: '1.25rem',
    color: '#ef4444',
    backgroundColor: 'transparent',
    border: '1px solid #ef4444',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    height: 'fit-content',
    marginTop: '1.75rem',
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
