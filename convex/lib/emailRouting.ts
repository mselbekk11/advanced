// Reads EMAIL_FROM, EMAIL_TO_OWNER and EMAIL_OVERRIDE_TO (e.g. process.env).
export type EmailEnv = Record<string, string | undefined>;

export type RoutedEmail = { from: string; to: string; subject: string };

// Resolves sender/recipient/subject from env. When EMAIL_OVERRIDE_TO is set
// (staging), every email goes to that address with a [STAGING] subject prefix.
export function routeEmail(
  env: EmailEnv,
  email: { to: string; subject: string }
): RoutedEmail {
  const from = env.EMAIL_FROM?.trim();
  if (!from) throw new Error('EMAIL_FROM is not set');
  const override = env.EMAIL_OVERRIDE_TO?.trim();
  if (override) {
    return { from, to: override, subject: `[STAGING] ${email.subject}` };
  }
  return { from, to: email.to, subject: email.subject };
}

export function ownerAddress(env: EmailEnv) {
  const to = env.EMAIL_TO_OWNER?.trim();
  if (!to) throw new Error('EMAIL_TO_OWNER is not set');
  return to;
}
