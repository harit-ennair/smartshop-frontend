import api from "./api";

export function getClients(params) {
  return api.get("/clients", { params });
}

export function getClientById(id) {
  return api.get(`/clients/${id}`);
}

export function createClient(data) {
  return api.post("/clients", data);
}

export function updateClient(id, data) {
  return api.put(`/clients/${id}`, data);
}
