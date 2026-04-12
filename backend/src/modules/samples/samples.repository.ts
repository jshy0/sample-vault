import { prisma } from "../../db";
import { CreateSampleDTO, SearchQueryDTO } from "./samples.schema";
import { Sample } from "./samples.types";

function flattenSample(sample: {
  id: string;
  userId: string;
  name: string;
  bpm: number | null;
  key: string | null;
  mode: string | null;
  tags: string[];
  fileUrl: string;
  createdAt: Date;
  user: { username: string };
}): Sample {
  const { user, ...rest } = sample;
  return { ...rest, username: user.username };
}

export const SamplesRepository = {
  async findAll(): Promise<Sample[]> {
    const samples = await prisma.sample.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { username: true } } },
    });
    return samples.map(flattenSample);
  },

  async findById(id: string, userId: string) {
    return prisma.sample.findFirst({ where: { id, userId } });
  },

  async findByIdPublic(id: string) {
    return prisma.sample.findUnique({ where: { id } });
  },

  async findDownload(userId: string, sampleId: string) {
    return prisma.download.findUnique({
      where: { userId_sampleId: { userId, sampleId } },
    });
  },

  async create(
    userId: string,
    data: CreateSampleDTO,
    fileUrl: string,
  ): Promise<Sample> {
    const [sample] = await prisma.$transaction([
      prisma.sample.create({
        data: {
          userId,
          name: data.name,
          bpm: data.bpm,
          key: data.key,
          mode: data.mode,
          tags: data.tags ?? [],
          fileUrl,
        },
        include: { user: { select: { username: true } } },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 4 } },
      }),
    ]);
    return flattenSample(sample);
  },

  async delete(id: string, userId: string): Promise<void> {
    await prisma.sample.deleteMany({ where: { id, userId } });
  },

  async search(params: SearchQueryDTO): Promise<Sample[]> {
    const samples = await prisma.sample.findMany({
      where: {
        ...(params.q && { name: { contains: params.q, mode: "insensitive" } }),
        ...(params.bpm_min !== undefined && { bpm: { gte: params.bpm_min } }),
        ...(params.bpm_max !== undefined && { bpm: { lte: params.bpm_max } }),
        ...(params.key && { key: params.key }),
        ...(params.mode && { mode: params.mode }),
      },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { username: true } } },
    });
    return samples.map(flattenSample);
  },
};
