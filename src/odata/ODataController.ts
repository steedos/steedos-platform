
import { Controller, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import { getCreator } from "../index";

/*
  https://github.com/typestack/routing-controllers
*/
@Controller()
export class ODataController {

   @Get("/api/odata/v4/:spaceId/:objectName")
   async getAll(@Param("spaceId") spaceId: string, @Param("objectName") objectName: string) {

      console.log(spaceId);
      console.log(objectName);
      var collection = getCreator().getCollection(objectName, spaceId);

      var records = collection.find({}).fetch();
      return records
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