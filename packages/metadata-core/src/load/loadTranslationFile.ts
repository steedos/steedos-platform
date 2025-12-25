/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-08-30 12:06:41
 * @LastEditors: Gemini Optimized
 * @LastEditTime: 2023-10-27 10:00:00
 * @Description: Optimized Translation Loader
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from "../typeInfo";
import { BaseLoadMetadataFile } from "./_baseLoadFile";
import path from "path";
import { loadFile } from "../loadFile";
import { syncMatchFiles } from "../util/match_files"; // 修复双斜杠
import { each } from "lodash";

// 定义提取的信息接口
interface TranslationFileInfo {
  lang: string;
  namespace?: string;
}

export class LoadTranslationFile extends BaseLoadMetadataFile {
  constructor() {
    super(TypeInfoKeys.Page);
  }

  /**
   * 解析文件名以获取语言和命名空间
   * 格式支持:
   * 1. {namespace}.{lang}.translation.yml
   * 2. {lang}.translation.yml
   */
  extractFileInfo(filePath: string): TranslationFileInfo | null {
    try {
      const filename = path.basename(filePath);

      // 正则解释：
      // ^(?:(?<namespace>.+)\.)?  -> 非捕获组，匹配可选的 "namespace."
      // (?<lang>[^.]+)            -> 捕获组，匹配 "lang" (不包含点)
      // \.translation\.yml$       -> 匹配固定的后缀
      const regex = /^(?:(?<namespace>.+)\.)?(?<lang>[^.]+)\.translation\.yml$/;

      const match = filename.match(regex);

      if (match && match.groups) {
        return {
          lang: match.groups.lang,
          namespace: match.groups.namespace, // 如果没有 namespace，这里会是 undefined
        };
      }

      console.warn(`extractFileInfo warn: Invalid file format: ${filename}`);
      return null;
    } catch (error) {
      console.error(`extractFileInfo error: ${filePath}`, error);
      return null;
    }
  }

  load(filePath: string) {
    let results: any[] = [];
    const filePattern = [
      path.join(filePath, "*.translation.yml"),
      "!" + path.join(filePath, "node_modules"),
    ];

    const matchedPaths: string[] = syncMatchFiles(filePattern);

    each(matchedPaths, (matchedPath: string) => {
      const fileInfo = this.extractFileInfo(matchedPath);

      if (fileInfo && fileInfo.lang) {
        const json = loadFile(matchedPath);
        results.push({
          lng: fileInfo.lang,
          namespace: fileInfo.namespace, // 新增 namespace 字段
          __filename: matchedPath,
          data: json,
        });
      }
    });

    return results;
  }
}
