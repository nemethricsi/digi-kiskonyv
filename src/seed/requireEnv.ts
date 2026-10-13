export function requireEnv(...names: string[]): string[] {
  const missing = names.filter((name) => !process.env[name])

  if (missing.length > 0) {
    throw new Error(`Missing env: ${missing.join(', ')}`)
  }

  return names.map((name) => process.env[name] as string)
}
