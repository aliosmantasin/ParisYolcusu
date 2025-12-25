/**
 * Click Queue
 * Batch click tracking için in-memory queue
 * Background job tarafından işlenir
 */

export interface QueuedClick {
  ipAddress: string;
  clicks: Array<{
    timestamp: number;
    targetInfo: {
      tagName: string;
      className: string;
      elementId: string; // 'id' yerine 'elementId' kullanıyoruz
      text: string;
      href: string;
    };
  }>;
  path: string;
  timestamp: number;
}

/**
 * In-memory click queue
 * Background job tarafından periyodik olarak işlenir
 */
export const clickQueue: QueuedClick[] = [];

