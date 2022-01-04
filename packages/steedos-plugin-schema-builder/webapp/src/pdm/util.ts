import { IField, IModel, IModule } from './../../../src/type'

interface IConvertTo {
  models: IModel[],
  modules: IModule[]
}

export const ConvertTo = (pdm) => {
      const nodes = Object.entries(pdm.parsedModel)
      .map(([k, v]) => v)
      .reduce((pres, model: any) => {

        const inRelations = model.inRelations
        const Relations = inRelations.reduce((preRelation, inRelation) => {
          const { parentTable , parentColumn, childColumn } = inRelation
          return {
              ...preRelation,
              [childColumn]: {
                parentTable,
                parentColumn,
              },
            }
        } , {})

        const node: IModel = {
            key: model.code,
            originalKey: model.code,
            name : model.conceptualName,
            type: model.dataType,
            moduleKey: pdm.parsedRoot.Code,
            fields:  model.columns.map((col) => {

              const  relationCol = Relations[col.code]
              const typeMeta = relationCol ? {
                relationModel: relationCol.parentTable,
                type: 'Relation',
              } : undefined

              return {
                type: col. dataType,
                key: relationCol ? 'toMany' : col.code,
                originalKey: col.code,
                typeMeta,
                name : col.conceptualName,
              }
            }),
         }
        return [
           ...pres, node,
         ]
      } , [])

      return {
        models: nodes,
        modules: [{
          name : pdm.parsedRoot.Name,
          key: pdm.parsedRoot.Code,
        }],
      }
}
