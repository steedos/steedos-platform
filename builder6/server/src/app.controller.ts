import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";

import { ApiTags } from "@nestjs/swagger";

@ApiTags("App")
@Controller("/")
export class AppController {
  @Get("/api/v6/amis/public_settings")
  getPublicSettings() {
    const publicEnv = {};
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("PUBLIC")) {
        publicEnv[key] = process.env[key];
      }
    });

    return {
      rootUrl: process.env.ROOT_URL,
      assetUrls: process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS
        ? process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS.split(",")
        : [],
      unpkgUrl: process.env.STEEDOS_UNPKG_URL,
      serverStatus: global.STEEDOS_STARTED ? "running" : "starting",
      steedosVersion: process.env.STEEDOS_VERSION,
      steedosAmisVersion: process.env.STEEDOS_AMIS_VERSION,
      PUBLIC_SETTINGS: {
        ...(global.Steedos.settings.PUBLIC_SETTINGS || {}),
        ...publicEnv,
      },
    };
  }

  @Get("/api/health_check")
  health_check() {
    return { status: "ok" };
  }

  @Post("/api/amis/health_check")
  @Get("/api/amis/health_check")
  amis_health_check() {
    return { status: 0, data: {} };
  }

  @Post("/api/v6/amis/health_check")
  @Get("/api/v6/amis/health_check")
  amis_health_check_v6() {
    return { status: 0, data: {} };
  }

  @Get(".well-known/appspecific/com.chrome.devtools.json")
  handleDevtoolsJson() {
    // Return empty or dummy data, adjust as needed
    return {};
  }
}
