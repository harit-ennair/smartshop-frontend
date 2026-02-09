import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCommandeById } from "../../services/commandes";
import { createPaiement } from "../../services/paiements";

export default function PaiementNew() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const commandeId = searchParams.get('commandeId');

  const [commande, setCommande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    montant: '',
    typePaiement: 'ESPECES',
  });

  useEffect(() => {
    if (commandeId) {
      loadCommande();
    } else {
      setLoading(false);
    }
  }, [commandeId]);

  async function loadCommande() {
    try {
      setLoading(true);
      const response = await getCommandeById(commandeId);
      const data = response.data.data || response.data;
      setCommande(data);
      
      // Pré-remplir avec le montant restant
      setFormData(prev => ({
        ...prev,
        montant: parseFloat(data.montantRestant || 0).toFixed(2)
      }));
    } catch (error) {
      console.error("Erreur chargement commande:", error);
      alert("Erreur lors du chargement de la commande");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!commandeId) {
      alert("Aucune commande sélectionnée");
      return;
    }

    const montant = parseFloat(formData.montant);
    const montantRestant = parseFloat(commande.montantRestant || 0);

    if (montant <= 0) {
      alert("Le montant doit être supérieur à 0");
      return;
    }

    if (montant > montantRestant) {
      alert(`Le montant ne peut pas dépasser le montant restant (${montantRestant.toFixed(2)} DH)`);
      return;
    }

    try {
      setSubmitting(true);
      
      const paiementData = {
        commandeId: parseInt(commandeId),
        montant: montant,
        typePaiement: formData.typePaiement,
      };

      await createPaiement(paiementData);
      alert("Paiement créé avec succès");
      navigate("/paiements");
    } catch (error) {
      console.error("Erreur création paiement:", error);
      alert("Erreur lors de la création du paiement");
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Chargement...</p>
      </div>
    );
  }

  if (!commandeId || !commande) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Aucune commande sélectionnée</h2>
          <p style={styles.errorText}>
            Veuillez sélectionner une commande depuis la liste des paiements
          </p>
          <button 
            onClick={() => navigate('/paiements')}
            style={styles.backButton}
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const montantRestant = parseFloat(commande.montantRestant || 0);
  const montantTotal = parseFloat(commande.total || 0);
  const montantPaye = montantTotal - montantRestant;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Nouveau Paiement</h1>
        <button 
          onClick={() => navigate('/paiements')}
          style={styles.cancelButton}
        >
          ← Retour
        </button>
      </div>

      {/* Détails de la commande */}
      <div style={styles.commandeCard}>
        <h2 style={styles.cardTitle}>Détails de la commande #{commande.id}</h2>
        
        <div style={styles.detailsGrid}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Client:</span>
            <span style={styles.detailValue}>{commande.clientNom || '-'}</span>
          </div>
          
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Date:</span>
            <span style={styles.detailValue}>
              {commande.date ? new Date(commande.date).toLocaleDateString('fr-FR') : '-'}
            </span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Montant Total:</span>
            <span style={styles.detailValue}>{montantTotal.toFixed(2)} DH</span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Déjà Payé:</span>
            <span style={{...styles.detailValue, color: '#10b981'}}>
              {montantPaye.toFixed(2)} DH
            </span>
          </div>

          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Reste à Payer:</span>
            <span style={{...styles.detailValue, color: '#ef4444', fontWeight: '700', fontSize: '1.2rem'}}>
              {montantRestant.toFixed(2)} DH
            </span>
          </div>
        </div>

        {commande.listeArticles && commande.listeArticles.length > 0 && (
          <div style={styles.articlesSection}>
            <h3 style={styles.articlesTitle}>Articles:</h3>
            <div style={styles.articlesList}>
              {commande.listeArticles.map((article, idx) => (
                <div key={idx} style={styles.articleItem}>
                  <span style={styles.articleName}>{article.produitNom}</span>
                  <span style={styles.articleQty}>×{article.quantite}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Formulaire de paiement */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formCard}>
          <h2 style={styles.cardTitle}>Informations du paiement</h2>

          <div style={styles.formGroup}>
            <label htmlFor="montant" style={styles.label}>
              Montant à payer <span style={styles.required}>*</span>
            </label>
            <input
              id="montant"
              name="montant"
              type="number"
              step="0.01"
              min="0.01"
              max={montantRestant}
              value={formData.montant}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="0.00"
            />
            <span style={styles.helpText}>
              Maximum: {montantRestant.toFixed(2)} DH
            </span>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="typePaiement" style={styles.label}>
              Mode de paiement <span style={styles.required}>*</span>
            </label>
            <select
              id="typePaiement"
              name="typePaiement"
              value={formData.typePaiement}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="ESPECES">Espèces</option>
              <option value="CARTE_BANCAIRE">Carte bancaire</option>
              <option value="CHEQUE">Chèque</option>
              <option value="VIREMENT">Virement</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate('/paiements')}
              style={styles.secondaryButton}
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Enregistrement...' : '💳 Enregistrer le paiement'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  commandeCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 1.5rem 0',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.75rem',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  detailLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '1rem',
    color: '#111827',
    fontWeight: '600',
  },
  articlesSection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
  },
  articlesTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 1rem 0',
  },
  articlesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  articleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    backgroundColor: '#f9fafb',
    borderRadius: '4px',
  },
  articleName: {
    flex: 1,
    color: '#374151',
    fontSize: '0.9rem',
  },
  articleQty: {
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#ffffff',
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
  },
  form: {
    width: '100%',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  helpText: {
    display: 'block',
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
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
    backgroundColor: '#10b981',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '3rem 2rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    border: '1px solid #fecaca',
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#991b1b',
    margin: '0 0 0.5rem 0',
  },
  errorText: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0 0 1.5rem 0',
  },
  backButton: {
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
