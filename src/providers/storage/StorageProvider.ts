import { fileProvider, FileProvider } from "@/consts/files";
import {
  localDeleteFile,
  localSaveFile,
} from "@/providers/storage/assets/Local";

export const saveFile = async (file: any, provider: FileProvider) => {
  switch (provider) {
    case fileProvider.LOCAL:
      return await localSaveFile(file);
    default:
      throw new Error(`Unsupported file provider: ${provider}`);
  }
};

export const deleteFile = async (file: any, provider: FileProvider) => {
  switch (provider) {
    case fileProvider.LOCAL:
      return await localDeleteFile(file);
    default:
      throw new Error(`Unsupported file provider: ${provider}`);
  }
};
