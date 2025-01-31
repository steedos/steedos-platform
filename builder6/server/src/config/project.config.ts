import { existsSync } from 'fs';
import { join } from 'path';

export default function getProjectConfigs(projectDir: string): any | null {
  const configPath = join(projectDir, 'b6.config.js');

  if (existsSync(configPath)) {
    return require(configPath);
  } else {
    return {}; // 或者根据需要返回其他值
  }
}
