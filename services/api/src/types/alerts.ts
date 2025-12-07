/**
 * Types pour le service d'alertes multi-signaux
 */

export type AlertLogic = 'AND' | 'OR';

export type SignalType =
  | 'options_flow'
  | 'insider_activity'
  | 'dark_pool'
  | 'short_interest'
  | 'greeks'
  | 'volume'
  | 'price';

export type ComparisonOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq';

export interface AlertCondition {
  /** Type de signal */
  signal: SignalType;
  /** Opérateur de comparaison */
  operator: ComparisonOperator;
  /** Valeur de seuil */
  value: number | string;
  /** Paramètres spécifiques au signal */
  params?: Record<string, any>;
}

export interface MultiSignalAlertConfig {
  /** ID de l'utilisateur */
  userId: string;
  /** Ticker (optionnel, peut être null pour alertes globales) */
  ticker?: string;
  /** Nom de l'alerte */
  name: string;
  /** Description */
  description?: string;
  /** Conditions à vérifier */
  conditions: AlertCondition[];
  /** Logique de combinaison (AND ou OR) */
  logic: AlertLogic;
  /** Canaux de notification */
  notificationChannels: NotificationChannel[];
  /** Actif ou non */
  active?: boolean;
}

export type NotificationChannel = 'email' | 'push' | 'sms' | 'webhook';

export interface Alert {
  /** ID unique de l'alerte */
  id: string;
  /** ID de l'utilisateur */
  userId: string;
  /** Ticker (optionnel) */
  ticker?: string;
  /** Nom de l'alerte */
  name: string;
  /** Description */
  description?: string;
  /** Conditions */
  conditions: AlertCondition[];
  /** Logique */
  logic: AlertLogic;
  /** Canaux de notification */
  notificationChannels: NotificationChannel[];
  /** Actif ou non */
  active: boolean;
  /** Date de création */
  createdAt: Date;
  /** Dernière vérification */
  lastChecked?: Date;
  /** Dernier déclenchement */
  lastTriggered?: Date;
}

export interface AlertTrigger {
  /** ID unique */
  id: string;
  /** ID de l'alerte */
  alertId: string;
  /** Ticker */
  ticker?: string;
  /** Date de déclenchement */
  triggeredAt: Date;
  /** Données au moment du déclenchement */
  data: Record<string, any>;
  /** Conditions qui ont déclenché */
  triggeredConditions: AlertCondition[];
  /** Lue ou non */
  read: boolean;
}

export interface AlertResponse {
  success: boolean;
  data?: {
    alert: Alert;
  };
  error?: string;
}

export interface AlertListResponse {
  success: boolean;
  data?: {
    alerts: Alert[];
    total: number;
  };
  error?: string;
}

export interface AlertTestResponse {
  success: boolean;
  data?: {
    triggered: boolean;
    conditions: Array<{
      condition: AlertCondition;
      met: boolean;
      value: any;
    }>;
    message?: string;
  };
  error?: string;
}

