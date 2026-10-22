// Only import this module from server code. No PUBLIC_ credentials exist.
export function env(name: string): string | undefined {
  return (
    process.env[name] ??
    (import.meta as ImportMeta & { env?: Record<string, string | undefined> })
      .env?.[name]
  );
}
