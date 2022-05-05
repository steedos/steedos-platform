import {executeQuery} from './executeQuery';

function odataQuery(repositoryOrQueryBuilder: any) {
  return async (req: any, res: any, next) => {
    try {
      const alias = '';

      const result = await executeQuery(repositoryOrQueryBuilder, req.query, {alias});
      return res.status(200).json(result);
    } catch (e) {
      console.log('ODATA ERROR',e);
      res.status(500).json({message: 'Internal server error.', error: {message: e.message}});
    }
    return next();
  }
}

export {odataQuery, executeQuery};