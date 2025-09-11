import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";

@Controller("/api/v6/app")
export class AppController {
  @Get("/public_settings")
  getPublicSettings() {
    return {
      rootUrl: process.env.ROOT_URL,
      assetUrls: process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS
        ? process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS.split(",")
        : [],
      unpkgUrl: process.env.STEEDOS_UNPKG_URL,
      serverStatus: global.STEEDOS_STARTED ? "running" : "starting",
      steedosVersion: process.env.STEEDOS_VERSION,
      steedosAmisVersion: process.env.STEEDOS_AMIS_VERSION,
      PUBLIC_SETTINGS: global.Steedos.settings.PUBLIC_SETTINGS || {},
    };
  }

  @Get("/health_check")
  health_check() {
    return { status: "ok" };
  }
}
