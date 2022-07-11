/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-10 15:44:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-10 17:03:14
 * @Description: 
 */
import Utils from "./utils";
import Lexer from "./lexer";
import Query from "./query";
import ResourcePath from "./resourcePath";

export namespace ODataUri {
    export function odataUri(value: Utils.SourceArray, index: number, metadataContext?: any): Lexer.Token {
        let resource = ResourcePath.resourcePath(value, index, metadataContext);
        while (!resource && index < value.length) {
            while (value[++index] !== 0x2f && index < value.length);
            resource = ResourcePath.resourcePath(value, index, metadataContext);
        }
        if (!resource) return;
        let start = index;
        index = resource.next;
        metadataContext = resource.metadata;

        let query;
        if (value[index] === 0x3f) {
            query = Query.queryOptions(value, index + 1, metadataContext);
            if (!query) return;
            index = query.next;
            delete resource.metadata;
        }

        return Lexer.tokenize(value, start, index, { resource, query }, Lexer.TokenType.ODataUri, <any>{ metadata: metadataContext });
    }
}

export default ODataUri;
