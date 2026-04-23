import { api } from "@/services/api";

import type { RegistryFormData } from "../types/registry.types";

export async function getClients() {
  const { data } = await api.get("/customers");
  return data;
}

export async function getSuppliers() {
  const { data } = await api.get("/suppliers");
  return data;
}

export async function getBanks() {
  const { data } = await api.get("/banks");
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/categories");
  return data;
}

export async function createEntity(endpoint: string, payload: RegistryFormData) {
  const { data } = await api.post(endpoint, payload);
  return data;
}