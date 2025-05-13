/** This class provides a template for all other classes to extend. */
export class BaseRecord {
  constructor(values: { id: number; created_at: Temporal.Instant; updated_at: Temporal.Instant }) {
    const { id, created_at, updated_at } = values;

    this.id = id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  id: number;
  created_at: Temporal.Instant;
  updated_at: Temporal.Instant;
}
