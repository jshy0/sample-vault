import cron from "node-cron";
import { prisma } from "../db";

// Every Monday at 00:00 (midnight)
export function startCreditTopUpJob() {
  cron.schedule("0 0 * * 1", async () => {
    await prisma.user.updateMany({
      where: { credits: { lt: 5 } },
      data: { credits: 5 },
    });
    console.log("[cron] Weekly credit top-up complete");
  });
}
