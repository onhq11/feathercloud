export const fileProvider = {
  LOCAL: "LOCAL",
  FTP: "FTP",
  SMB: "SMB",
} as const;

export type FileProvider = keyof typeof fileProvider;
