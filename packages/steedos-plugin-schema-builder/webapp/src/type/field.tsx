export interface IField {
  type: string ,
  key: string ,
  name: string ,
  originalKey: string ,
  typeMeta?: {
    type: string,
    relationModel: string,
  }
}
