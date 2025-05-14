/** Basic email type; comprised of address and domain parts. */
export type Email = `${string}@${string}`;

/** String union of valid repeat units. */
export type RepeatUnit = "day" | "week" | "month" | "year";

/** Union type for valid vote answers. */
export type VoteAnswer = 1 | 0;

/**
 * Union type for valid {@link CalendarAccess} and {@link SpaceAccess} permissions codes.
 * @remarks
 * These codes are similar to the binary *nix representation of file permissions.
 * In place of execute, the 3rd 'bit' represents delete permission.
 * - `100` -> Read only
 * - `110` -> Read & Write
 * - `111` -> Read, Write & Delete
 */
export type AccessPermissions = 100 | 110 | 111;
