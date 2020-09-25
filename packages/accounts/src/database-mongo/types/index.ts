export interface AccountsMongoOptions {
  /**
   * The users collection name, default 'users'.
   */
  collectionName?: string;
  /**
   * The sessions collection name, default 'sessions'.
   */
  sessionCollectionName?: string;
  /**
   * The timestamps for the users and sessions collection, default 'createdAt' and 'updatedAt'.
   */
  timestamps?: {
    createdAt: string;
    updatedAt: string;
  };
  /**
   * Should the user collection use _id as string or ObjectId, default 'true'.
   */
  convertUserIdToMongoObjectId?: boolean;
  /**
   * Should the session collection use _id as string or ObjectId, default 'true'.
   */
  convertSessionIdToMongoObjectId?: boolean;
  /**
   * Perform case intensitive query for user name, default 'true'.
   */
  caseSensitiveUserName?: boolean;
  /**
   * Function that generate the id for new objects.
   */
  idProvider?: () => string | object;
  /**
   * Function that generate the date for the timestamps.
   */
  dateProvider?: (date?: Date) => any;
}

export interface MongoUser {
  _id?: string | object;
  username?: string;
  services: {
    password?: {
      bcrypt: string;
    };
  };
  emails?: [
    {
      address: string;
      verified: boolean;
    }
  ];
  [key: string]: any;
}
