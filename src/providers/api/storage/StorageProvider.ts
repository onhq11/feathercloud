import { FileProvider, fileProvider } from "@/enums/fileProvider.ts";
import {
  localDeleteFile,
  localReadFile,
  localSaveFile,
} from "@/providers/api/storage/assets/Local";

export const saveFile = async (file: any, provider: FileProvider) => {
  switch (provider) {
    case fileProvider.LOCAL:
      return await localSaveFile(file);
    default:
      throw new Error(`Unsupported file provider: ${provider}`);
  }
};

export const readFile = async (file: any, provider: FileProvider) => {
  switch (provider) {
    case fileProvider.LOCAL:
      return await localReadFile(file);
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
