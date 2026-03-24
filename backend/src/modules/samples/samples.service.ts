import { StringFormatParams } from "zod/v4/core";
import { SamplesRepository } from "./samples.repository";
import { CreateSampleDTO } from "./samples.schema";

export const SamplesService = {
  async getAllSamples(userId: string) {
    return SamplesRepository.findAll(userId);
  },

  async createSample(userId: string, data: CreateSampleDTO) {
    return SamplesRepository.create(userId, data);
  },
};
