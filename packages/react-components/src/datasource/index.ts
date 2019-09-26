import * as Odata from 'ts-odata-client'
import utils from '../utils'

export async function query(service: string, options: any = {pageSize: 10, currentPage: 0}){
    const objectName = options.objectName;
    let {currentPage, pageSize, $select} = options
    let skip = currentPage * pageSize

    let spaceId = utils.getCookie("X-Space-Id");
    let authToken = utils.getCookie("X-Auth-Token");
    let userId = utils.getCookie("X-User-Id")
    
    const endpoint = `${service}/api/odata/v4/${spaceId}/${objectName}`;
    const requestInit = ()=>{
        return {
            headers: {
                'X-Auth-Token': authToken,
                'X-User-Id': userId
            }
        }
    }
    const baseQuery = Odata.ODataV4QueryProvider.createQuery<any>(endpoint, requestInit);
    let query = baseQuery.skip(skip || 0)

    if(pageSize){
        query = query.top(pageSize)
    }

    if($select){
        query = query.select(...$select)
    }
    if(options.filters){
        options.filters.forEach((element: any) => {
            query = query.filter((p: any) => p[element.operation](element.columnName, element.value));
        });
    }
    let results = await query.getManyAsync();
    return results
}