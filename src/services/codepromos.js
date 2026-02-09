import api from "./api";

export function getCodePromos(params) {
  return api.get("/codepromos", { params });
}

export function getCodePromoById(id) {
  return api.get(`/codepromos/${id}`);
}

export function createCodePromo(data) {
  return api.post("/codepromos", data);
}

export function updateCodePromo(id, data) {
  return api.put(`/codepromos/${id}`, data);
}

export function changeCodePromoStatus(id, status) {
  return api.patch(`/codepromos/${id}/status?status=${status}`);
}

export function deleteCodePromo(id) {
  return api.delete(`/codepromos/${id}`);
}
