import { getAllAction } from "./controller/GetAllAction";

/**
 * All application routes.
 */
export const Routes = [
    {
        path: "/api/odata/v4/:spaceId/:objectName",
        method: "get",
        action: getAllAction
    }
];