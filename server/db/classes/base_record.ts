/** This class provides a template for all other classes to extend. */
export class BaseRecord {
  constructor(values: { id: number; created_at: Temporal.Instant }) {
    this.id = values.id;
    this.created_at = values.created_at;
  }

  id: number;
  created_at: Temporal.Instant;
}
