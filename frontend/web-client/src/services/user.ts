import api from "./api";
import type { User } from "../types";

export const userService = {
  getById: (id: number) => api.get<User>(`/api/users/${id}`),

  searchByUsername: (username: string) =>
    api.get<User>("/api/users/search", { params: { username } }),

  searchUsers: (q: string) =>
    api.get<User[]>("/api/users/search/query", { params: { q } }),

  getAlumni: () => api.get<User[]>("/api/users/alumni"),
};
