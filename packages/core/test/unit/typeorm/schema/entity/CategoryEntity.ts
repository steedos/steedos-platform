import {EntitySchema} from "typeorm";
import {Category} from "../model/Category";

export const CategoryEntity = new EntitySchema<Category>({
    name: "category",
    columns: {
        id: {
            type: String,
            objectId: true,
            primary: true
        },
        name: {
            type: String
        }
    }
});