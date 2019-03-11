
import {Controller, Req, Res, Param, Body, Get, Post, Put, Delete} from "routing-controllers";
import { getConnection } from "../";

/* 
  https://github.com/typestack/routing-controllers 
*/
@Controller()
export class ODataController {

    @Get("/api/odata/v4/:spaceId/:objectName")
    async getAll(@Req() request: any, @Res() response: any) {
       
      const spaceId = request.params.spaceId;
      const entityName = request.params.objectName;
      console.log(spaceId);
      
      // get a repository
      const repository = getConnection().getRepository(entityName);

      // load records
      const records = await repository.find();

      // return loaded records
      response.send(records);
    }

    @Get("/api/odata/v4/:spaceId/:objectName/:id")
    getOne(@Param("id") id: number) {
       return "This action returns record #" + id;
    }

    @Post("/api/odata/v4/:spaceId/:objectName")
    post(@Body() user: any) {
       return "Saving record...";
    }

    @Put("/api/odata/v4/:spaceId/:objectName/:id")
    put(@Param("id") id: number, @Body() user: any) {
       return "Updating a record...";
    }

    @Delete("/api/odata/v4/:spaceId/:objectName/:id")
    remove(@Param("id") id: number) {
       return "Removing record...";
    }

}