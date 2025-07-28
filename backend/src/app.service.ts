import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public static logs: any[] = [];

  async filterLogs(
    vehicle?: string,
    code?: string,
    from?: string,
    to?: string,
  ): Promise<any> {
    const logs = AppService.logs;
    const filtered = logs.filter((log) => {
      const matchesVehicle = vehicle ? log.vehicleId === vehicle : true;
      const matchesCode = code ? log.code === code : true;

      const matchesTime = (() => {
        if (from && to && log.timestamp) {
          const logTime = new Date(log.timestamp).getTime();
          const fromTime = new Date(from).getTime();
          const toTime = new Date(to).getTime();
          return logTime >= fromTime && logTime <= toTime;
        }
        return true;
      })();

      return matchesVehicle && matchesCode && matchesTime;
    });

    return filtered;
  }

  async processFile(content: string): Promise<any[]> {
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const logs = lines.map((line) => {
      const timeMatch = line.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})]/);
      const vehicleMatch = line.match(/\[VEHICLE_ID:(\d+)]/);
      const codeMatch = line.match(/\[CODE:([A-Z0-9]+)]/);
      const messageMatch = line.match(/\[([^\[\]]+)]$/);

      return {
        vehicleId: vehicleMatch?.[1] ?? null,
        code: codeMatch?.[1] ?? null,
        timestamp: timeMatch?.[1] ?? null,
        message: messageMatch?.[1] ?? null,
      };
    });

    AppService.logs = logs;
    return logs;
  }
}
