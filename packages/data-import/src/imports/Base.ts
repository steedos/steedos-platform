export interface Base {
    userSession: any;
    readFile(filePath: string, options?: any): any
    fileRecordsToDB(filePath: any): any
}