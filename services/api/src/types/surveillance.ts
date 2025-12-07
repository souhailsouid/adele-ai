/**
 * Types pour le service de surveillance
 */

export interface SurveillanceConfig {
  /** Ticker à surveiller */
  ticker: string;
  /** Premium minimum pour filtrer les options flow */
  minPremium?: number;
  /** Seuil de volume d'options call (en $) */
  callVolumeThreshold?: number;
  /** Seuil de volume d'options put (en $) */
  putVolumeThreshold?: number;
  /** Seuil de dark pool volume (en $) */
  darkPoolVolumeThreshold?: number;
  /** Seuil de short interest ratio (%) */
  shortInterestThreshold?: number;
  /** Seuil de changement de position insider (%) */
  insiderChangeThreshold?: number;
  /** Intervalle de vérification en minutes (défaut: 5) */
  checkInterval?: number;
  /** Canaux de notification */
  notificationChannels?: NotificationChannel[];
  /** Actif ou non */
  active?: boolean;
}

export type NotificationChannel = 'email' | 'push' | 'sms' | 'webhook';

export interface SurveillanceWatch {
  /** ID unique de la surveillance */
  id: string;
  /** ID de l'utilisateur */
  userId: string;
  /** Ticker surveillé */
  ticker: string;
  /** Configuration */
  config: SurveillanceConfig;
  /** Date de création */
  createdAt: Date;
  /** Dernière vérification */
  lastChecked?: Date;
  /** Actif ou non */
  active: boolean;
}

export interface SurveillanceAlert {
  /** ID unique de l'alerte */
  id: string;
  /** ID de la surveillance */
  watchId: string;
  /** Ticker */
  ticker: string;
  /** Type d'alerte */
  type: AlertType;
  /** Message */
  message: string;
  /** Données associées */
  data: Record<string, any>;
  /** Date de déclenchement */
  triggeredAt: Date;
  /** Lue ou non */
  read: boolean;
}

export type AlertType =
  | 'options_flow_spike'
  | 'dark_pool_activity'
  | 'short_interest_change'
  | 'insider_activity'
  | 'volume_surge'
  | 'price_movement'
  | 'custom';

export interface SurveillanceResponse {
  success: boolean;
  data?: {
    watch: SurveillanceWatch;
  };
  error?: string;
}

export interface SurveillanceListResponse {
  success: boolean;
  data?: {
    watches: SurveillanceWatch[];
    total: number;
  };
  error?: string;
}

export interface SurveillanceAlertsResponse {
  success: boolean;
  data?: {
    alerts: SurveillanceAlert[];
    total: number;
  };
  error?: string;
}

