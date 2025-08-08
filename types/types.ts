/** String union of valid repeat units. */
export type RepeatUnit = 'day' | 'week' | 'month' | 'year';

/**
 * Enum for valid permissions codes.
 * @remarks
 * These codes are similar to the binary representation *nix of file permissions.
 * In place of execute, the 3rd 'bit' represents delete permissions.
 * - `100` -> Read only
 * - `110` -> Read & Write
 * - `111` -> Read, Write & Delete
 */
export enum AccessPermissions {
  ReadOnly = 100,
  ReadWrite = 110,
  ReadWriteDelete = 111,
}
