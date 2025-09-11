import path, { join } from "path";
import { AppController } from "./app.controller";
import { AppMoleculer } from "./app.moleculer";
import { AppGateway } from "./app.gateway";
import express from "express";

import { getMoleculerConfigs, getSteedosConfigs } from "./config";
import { InstanceFileController } from "./workflow/file.controller";
import { FileService } from "./workflow/file.service";
import { FileMoleculer } from "./workflow/file.moleculer";
import { readFileSync } from "fs";

const steedosConfig = getSteedosConfigs();

export const modulesConfig = {
  moleculer: (config) => {
    return {
      ...config,
      ...getMoleculerConfigs(),
      ...steedosConfig,
    };
  },
};

export const beforeServerStart = async ({ app }) => {};

export const controllers = [AppController, InstanceFileController];

export const providers = [AppMoleculer, AppGateway, FileService, FileMoleculer];
