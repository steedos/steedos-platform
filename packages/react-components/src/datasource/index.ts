import * as Odata from 'ts-odata-client'

export async function query(options: any = {pageSize: 10, currentPage: 0}){
    const objectName = options.objectName;
    let {currentPage, pageSize, $select} = options
    let skip = currentPage * pageSize
    const endpoint = `http://192.168.3.2:5000/api/odata/v4/51ae9b1a8e296a29c9000001/${objectName}`;
    const requestInit = ()=>{
        return {
            headers: {
                'X-Auth-Token': 'qeY7uk7tiifhDyElCDVKHEKrJndZJ5N1VCF6KZQYgkg',
                'X-User-Id': '51a842c87046900538000001'
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