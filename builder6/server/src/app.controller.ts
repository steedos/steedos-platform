import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";

@Controller("/api/")
export class AppController {
  @Get("/v6/amis/public_settings")
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

  @Post("/amis/health_check")
  @Get("/amis/health_check")
  amis_health_check() {
    return { status: 0, data: {} };
  }

  @Post("/v6/amis/health_check")
  @Get("/v6/amis/health_check")
  amis_health_check_v6() {
    return { status: 0, data: {} };
  }
}
