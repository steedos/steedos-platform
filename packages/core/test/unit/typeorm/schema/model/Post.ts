import {Category} from "./Category";

export interface Post {

    id: string;
    title: string;
    text: string;
    categories: Category[];

}