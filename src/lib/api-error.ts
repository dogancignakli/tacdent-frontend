export function isSessionExpiredMessage(message: string): boolean {
  return message.includes("session has expired") || message.includes("Oturumunuz sona erdi");
}
