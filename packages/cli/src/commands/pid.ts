import * as fs from "fs";
import * as path from "path";

export const PID_FILE = ".steedos.pid";

export function getPidFilePath(): string {
  return path.join(process.cwd(), PID_FILE);
}

export function writePidFile(): void {
  fs.writeFileSync(getPidFilePath(), String(process.pid), "utf-8");
}

export function removePidFile(): void {
  const pidFile = getPidFilePath();
  if (fs.existsSync(pidFile)) {
    fs.unlinkSync(pidFile);
  }
}
