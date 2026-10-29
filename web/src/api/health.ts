import { HEALTH_PATH } from "../constants/api";
import type { Health } from "../types/health";
import { apiClient } from "./client";

export const getHealth = () => apiClient.get<Health>(HEALTH_PATH);
