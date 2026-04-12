import { SamplesRepository } from "./samples.repository.js";
import { StorageService } from "../../services/storage.service.js";
import { CreateSampleDTO, SearchQueryDTO } from "./samples.schema.js";
import { prisma } from "../../db.js";

export const SamplesService = {
  async getAllSamples() {
    return SamplesRepository.findAll();
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

    await StorageService.delete(sample.fileUrl);
    await SamplesRepository.delete(id, userId);
  },

  async searchSamples(params: SearchQueryDTO) {
    const samples = await SamplesRepository.search(params);
    return samples;
  },

  async downloadSample(sampleId: string, userId: string): Promise<string> {
    const sample = await SamplesRepository.findByIdPublic(sampleId);
    if (!sample) throw Object.assign(new Error("Not found"), { status: 404 });

    const isOwn = sample.userId === userId;
    const alreadyDownloaded =
      !isOwn && (await SamplesRepository.findDownload(userId, sampleId));

    if (!isOwn && !alreadyDownloaded) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user)
        throw Object.assign(new Error("User not found"), { status: 404 });
      if (user.credits < 1)
        throw Object.assign(new Error("Insufficient credits"), { status: 402 });

      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: 1 } },
        }),
        prisma.download.create({ data: { userId, sampleId } }),
      ]);
    }

    return StorageService.getPresignedUrl(sample.fileUrl);
  },
};
