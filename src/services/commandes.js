import api from "./api";

export function getCommandes(params) {
  return api.get("/commandes", { params });
}

export function getCommandeById(id) {
  return api.get(`/commandes/${id}`);
}

export function createCommande(data) {
  return api.post("/commandes", data);
}

export function confirmCommande(id) {
  return api.patch(`/commandes/${id}/confirm`);
}

export function cancelCommande(id) {
  return api.patch(`/commandes/${id}/cancel`);
}
