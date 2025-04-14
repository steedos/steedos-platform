import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from "@nestjs/common";

@Controller("/api")
export class AppController {
  @Get("/public/settings")
  getPublicSettings() {
    return {
      rootUrl: process.env.ROOT_URL,
      assetUrls: process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS
        ? process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS.split(",")
        : [],
      unpkgUrl: process.env.STEEDOS_UNPKG_URL,
    };
  }
}
