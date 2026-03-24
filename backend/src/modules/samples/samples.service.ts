import { SamplesRepository } from "./samples.repository.js";
import { StorageService } from "../../services/storage.service.js";
import { CreateSampleDTO } from "./samples.schema.js";

export const SamplesService = {
  async getAllSamples(userId: string) {
    return SamplesRepository.findAll(userId);
  },

  async createSample(
    userId: string,
    data: CreateSampleDTO,
    file: Express.Multer.File,
  ) {
    const fileUrl = await StorageService.upload(file, userId);
    return SamplesRepository.create(userId, data, fileUrl);
  },

  async deleteSample(id: string, userId: string) {
    const sample = await SamplesRepository.findById(id, userId);
    if (!sample) {
      throw Object.assign(new Error("Sample not found"), { status: 404 });
    }

    await StorageService.delete(sample.file_url);
    await SamplesRepository.delete(id, userId);
  },
};
