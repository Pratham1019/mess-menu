import { BlobNotFoundError, del, get, put } from "@vercel/blob";
import { boundedText } from "./http";
import { env } from "./env";
import { parseOverride, parseSnapshot } from "../validation";
import { isDate } from "../dates";
import {
  isMeal,
  isMess,
  type Meal,
  type Mess,
  type Override,
  type Snapshot,
} from "../menu";

export function storageReady(): boolean {
  return Boolean(env("BLOB_READ_WRITE_TOKEN"));
}
function token(): string {
  const value = env("BLOB_READ_WRITE_TOKEN");
  if (!value) throw new Error("Storage unavailable");
  return value;
}
export function overridePath(date: string, mess: Mess, meal: Meal): string {
  if (!isDate(date) || !isMess(mess) || !isMeal(meal))
    throw new Error("Invalid storage key");
  return `overrides/${date}/${mess}/${meal}.json`;
}
function snapshotPath(date: string, mess: Mess): string {
  if (!isDate(date) || !isMess(mess)) throw new Error("Invalid storage key");
  return `snapshots/${date}/${mess}.json`;
}
async function read(path: string): Promise<unknown | null> {
  try {
    const result = await get(path, {
      access: "private",
      useCache: false,
      token: token(),
      abortSignal: AbortSignal.timeout(5000),
    });
    if (!result) return null;
    if (result.statusCode !== 200)
      throw new Error("Unexpected storage response");
    return JSON.parse(await boundedText(result.stream, 80_000)) as unknown;
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}
async function write(path: string, value: unknown) {
  await put(path, JSON.stringify(value), {
    token: token(),
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    abortSignal: AbortSignal.timeout(5000),
  });
}
export async function readSnapshot(
  date: string,
  mess: Mess,
): Promise<Snapshot | null> {
  if (!storageReady()) return null;
  const value = await read(snapshotPath(date, mess));
  if (value === null) return null;
  const snapshot = parseSnapshot(value);
  if (snapshot.date !== date || snapshot.mess !== mess)
    throw new Error("Snapshot identity mismatch");
  return snapshot;
}
export async function writeSnapshot(snapshot: Snapshot): Promise<void> {
  if (storageReady())
    await write(
      snapshotPath(snapshot.date, snapshot.mess),
      parseSnapshot(snapshot),
    );
}
export async function readOverride(
  date: string,
  mess: Mess,
  meal: Meal,
): Promise<Override | null> {
  if (!storageReady()) return null;
  const value = await read(overridePath(date, mess, meal));
  if (value === null) return null;
  const override = parseOverride(value);
  if (
    override.date !== date ||
    override.mess !== mess ||
    override.meal !== meal
  )
    throw new Error("Override identity mismatch");
  return override;
}
export async function saveOverride(override: Override): Promise<void> {
  const valid = parseOverride(override);
  await write(overridePath(valid.date, valid.mess, valid.meal), valid);
}
export async function deleteOverride(
  date: string,
  mess: Mess,
  meal: Meal,
): Promise<void> {
  await del(overridePath(date, mess, meal), {
    token: token(),
    abortSignal: AbortSignal.timeout(5000),
  });
}
