import { Client } from '@elastic/elasticsearch';
import { Request } from 'express';

// const elasticNode1 = process.env.ELASTICSEARCH_NODE1;
// const elasticNode2 = process.env.ELASTICSEARCH_NODE2;

export const elasticClient = new Client({
  // node: process.env.ELASTICSEARCH_HOST || 'localhost',
  // nodes: [elasticNode1, elasticNode2],
  nodes: [process.env.ELASTICSEARCH_HOST || 'localhost'],
});

// ping the client to be sure Elasticsearch is up

/**
 * @function addDocumentToIndex,
 * @returns {Promise<any>}
 * @description creates a document in a given index.
 */
export const addDocumentToIndex = async (index: string, body: any) => {
  return new Promise((resolve, reject) => {
    elasticClient
      .index({ index, body })
      .then(response => {
        console.log(`Indexing to ${index} was successful`);
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const searchIndex = async (
  req: Request,
  index: string,
  fields: string[],
  size?: string
) => {
  return new Promise((resolve, reject) => {
    elasticClient
      .search({
        index,
        body: {
          // from: 0,
          // size,
          query: {
            multi_match: {
              query: req.query.search,
              fields,
            },
            // OR
            // match: {
            //   statusCode: query,
            // },
            // match_phrase: {
            //   Title: { query: req.params.title, slop: 100 },
            // },
          },
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
};
