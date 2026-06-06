import { apiClient } from "../api/client.js";

// CREATE
export const submitContact = async (data) => {
  console.log(data)
  return apiClient("/api/v1/contacts/create", {
    method: "POST",
    body: data,
  });
};

// READ (LIST) — accepts an optional query string, e.g. "?page=1&status=new"
export const getContacts = async (query = "") => {
  return apiClient(`/api/v1/contacts${query}`);
};
export const getContactsAll = async () => {
  return apiClient(`/api/v1/contacts`);
};

// DELETE
export const deleteContact = async (id) => {
  return apiClient(`/api/v1/contacts/${id}`, {
    method: "DELETE",
  });
};

// UPDATE STATUS
export const updateContactStatus = async (id, status) => {
  return apiClient(`/api/v1/contacts/${id}/status`, {
    method: "PATCH",
    body: { status },
  });
};