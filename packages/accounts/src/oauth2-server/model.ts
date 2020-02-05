import {getConnection} from '@steedos/objectql';

let connection = getConnection();

/**
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
    // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
    return OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
  };
  
  /**
   * Get client.
   */
  module.exports.getClient = function(clientId, clientSecret) {
    return OAuthClientsModel.findOne({ clientId: clientId, clientSecret: clientSecret }).lean();
  };
  
  /**
   * Get refresh token.
   */
  
  module.exports.getRefreshToken = function(refreshToken) {
    return OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();
  };
  
  /**
   * Get user.
   */
  
  module.exports.getUser = function(username, password) {
    return OAuthUsersModel.findOne({ username: username, password: password }).lean();
  };
  
  /**
   * Save token.
   */
  
  module.exports.saveToken = function(token, client, user) {
  }