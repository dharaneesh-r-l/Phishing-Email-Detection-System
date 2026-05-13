
import type { InsertScan, Scan } from "@shared/schema";

export interface IStorage {
  createScan(scan: InsertScan): Promise<Scan>;
  getScans(): Promise<Scan[]>;
}

class MemoryStorage implements IStorage {
  private scans: Scan[] = [];
  private nextId = 1;

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const scan: Scan = {
      id: this.nextId++,
      emailId: insertScan.emailId ?? null,
      subject: insertScan.subject ?? null,
      content: insertScan.content,
      prediction: insertScan.prediction,
      confidence: insertScan.confidence,
      probability: insertScan.probability,
      stats: insertScan.stats,
      createdAt: new Date(),
    };
    this.scans.unshift(scan);
    return scan;
  }

  async getScans(): Promise<Scan[]> {
    return [...this.scans];
  }
}

export const storage: IStorage = new MemoryStorage();
