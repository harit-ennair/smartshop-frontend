import api from "./api";

export const createPaiement = (data) => api.post("/paiements", data);

export const encaisserPaiement = (id) => api.patch(`/paiements/${id}/encaisser`);

export const rejeterPaiement = (id) => api.patch(`/paiements/${id}/rejeter`);
