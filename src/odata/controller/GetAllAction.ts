import { Request, Response } from "express";
import { getManager } from "typeorm";

/**
 * Loads all data from the database.
 */
export async function getAllAction(request: Request, response: Response) {

    // const spaceId = request.params.spaceId;
    const entityName = request.params.objectName;
    // get a repository
    const repository = getManager().getRepository(entityName);

    // load records
    const records = await repository.find();

    // return loaded records
    response.send(records);
}