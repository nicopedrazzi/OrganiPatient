import { db } from "..";
import { reportsData } from "../schema";
import { newReport } from "../schema";
import { and, eq, isNull } from "drizzle-orm";

export async function newReport(report: newReport){
    const [result] = await db.insert(reportsData).values(report).returning();
    return result;
};

export async function getReport(reportId:number){
  const [report] = await db.select().from(reportsData).where(eq(reportsData.id,reportId));
  return report;
};

export async function softDeleteReport(reportId: number, userId: number) {
  const [result] = await db
    .update(reportsData)
    .set({ removedAt: new Date() })
    .where(
      and(
        eq(reportsData.id, reportId),
        eq(reportsData.userId, userId),
        isNull(reportsData.removedAt),
      ),
    )
    .returning();

  return result;
}

export async function updateReportAnonymization(
  reportId: number,
  userId: number,
  isAnonymized: boolean,
) {
  const [result] = await db
    .update(reportsData)
    .set({ isAnonymized })
    .where(
      and(
        eq(reportsData.id, reportId),
        eq(reportsData.userId, userId),
        isNull(reportsData.removedAt),
      ),
    )
    .returning();

  return result;
}

export async function hardResetUserReport(userId: number, reportId:number) {
  const deletedReports = await db
    .delete(reportsData)
    .where(and(
      eq(reportsData.userId, userId),
      eq(reportsData.id,reportId)))
    .returning();
  return deletedReports;
}
