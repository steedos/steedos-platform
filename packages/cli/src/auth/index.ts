import axios, { AxiosRequestConfig } from "axios";
import _ from "lodash";
import {
  getMetaDataSpaceId,
  getMetaDataAuthToken,
  getMetaDataUrl,
  loadENV,
  getMetaDataSpaceToken,
  getAuthorization,
  getAPIAuthorization,
} from "@steedos/metadata-core";

loadENV();

export async function authRequest(
  url: string,
  requestOptions: any,
  requestCallback?: (error: any, response: any, body: any) => void,
) {
  const metadataURL = getMetaDataUrl();
  const fullUrl = `${metadataURL}${url}`;

  if (!requestOptions.headers) {
    requestOptions.headers = {};
  }

  if (!_.has(requestOptions.headers, "Authorization")) {
    requestOptions.headers["Authorization"] = getAPIAuthorization();
  }

  try {
    const response = await axios({
      url: fullUrl,
      method: requestOptions.method || "GET",
      headers: requestOptions.headers,
      params: requestOptions.qs, // request → axios 差异
      data: requestOptions.body || requestOptions.form, // 支持 body/form
      timeout: requestOptions.timeout,
    });

    if (requestCallback) {
      requestCallback(null, response, response.data);
    }
    return response;
  } catch (error) {
    if (requestCallback) {
      requestCallback(error, error.response, error.response?.data);
    }
    throw error;
  }
}
