import axios, { AxiosInstance, AxiosResponse } from "axios";

// Define the structure of the API response for successful operations
interface ApiResponse<T> {
  status: number;
  msg: string;
  data: T;
}

// Define the structure for error responses
interface ApiResponseError {
  status: number; // Typically -1 for errors
  msg: string;
  data: Record<string, any>;
}

// Define interfaces for various request and response data structures

// GET /api/v1/{objectName}
interface GetListParams {
  objectName: string;
  filters?: string; // JSON string, e.g., '[["amount", ">", 100000]]'
  fields?: string; // JSON string, e.g., '["name", "amount", "created"]'
  sort?: string; // e.g., 'created desc'
  top?: number; // Max 5000
  skip?: number;
}

interface Item {
  _id: string;
  [key: string]: any;
}

interface GetListResponseData {
  items: Item[];
  total: number;
}

// POST /api/v1/{objectName}
interface CreateRecordParams {
  objectName: string;
  doc: Record<string, any>;
}

interface CreateRecordResponseData {
  _id: string;
  name: string;
  [key: string]: any;
}

// POST /api/v1/{objectName}/search
interface SearchRecordsRequest {
  filters: string[][]; // e.g., [["amount", ">", 100000]]
  fields?: string[]; // e.g., ["name", "amount", "created"]
  sort?: string; // e.g., 'created desc'
  top?: number;
  skip?: number;
}

interface SearchRecordsResponseData {
  items: Item[];
  total: number;
}

// GET /api/v1/{objectName}/{id}
interface GetRecordParams {
  objectName: string;
  id: string;
  fields?: string; // JSON string, e.g., '["name", "amount", "created"]'
}

interface GetRecordResponseData {
  _id: string;
  amount: number;
  name: string;
  created: string;
  // Add other fields as necessary
}

// PUT /api/v1/{objectName}/{id}
interface UpdateRecordParams {
  objectName: string;
  id: string;
  doc: Record<string, any>;
}

interface UpdateRecordResponseData {
  // Define based on the response structure
  [key: string]: any;
}

// DELETE /api/v1/{objectName}/{id}
interface DeleteRecordParams {
  objectName: string;
  id: string;
}

interface DeleteRecordResponseData {
  _id: string;
}

// GET /api/files/files/{fileId}
interface DownloadFileParams {
  fileId: string;
}

// POST /s3/files/
interface UploadFileResponseData {
  _id: string;
  link: string;
  original: {
    type: string;
    size: number;
    name: string;
  };
  metadata: Record<string, any>;
  uploadedAt: string;
  copies: Record<string, any>;
  // Add other fields as necessary
}

export class ServiceRecordsApi {
  private axiosInstance: AxiosInstance;

  /**
   * Initializes the ServiceRecordsApi instance.
   * @param baseURL The base URL of the API, e.g., 'http://127.0.0.1:5100/'
   * @param apiKey The API key for Bearer authentication
   */
  constructor(
    private baseURL: string,
    private apiKey: string,
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
    });

    // Add a request interceptor to include the Authorization header
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.apiKey) {
          config.headers["Authorization"] = `Bearer ${this.apiKey}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );
  }

  /**
   * Handles API responses, distinguishing between success and error responses.
   * @param response The Axios response object
   */
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    if (response.data.status === 0) {
      return response.data.data;
    } else {
      throw new Error(response.data.msg || "API Error");
    }
  }

  /**
   * Fetches a list of records.
   * GET /api/v1/{objectName}
   */
  async getList(params: GetListParams): Promise<GetListResponseData> {
    const { objectName, filters, fields, sort, top, skip } = params;
    const response = await this.axiosInstance.get<
      ApiResponse<GetListResponseData>
    >(`/api/v1/${encodeURIComponent(objectName)}`, {
      params: {
        filters,
        fields,
        sort,
        top,
        skip,
      },
    });
    return this.handleResponse<GetListResponseData>(response);
  }

  /**
   * Creates a new record.
   * POST /api/v1/{objectName}
   */
  async createRecord(
    params: CreateRecordParams,
  ): Promise<CreateRecordResponseData> {
    const { objectName, doc } = params;
    const response = await this.axiosInstance.post<
      ApiResponse<CreateRecordResponseData>
    >(`/api/v1/${encodeURIComponent(objectName)}`, { doc });
    return this.handleResponse<CreateRecordResponseData>(response);
  }

  /**
   * Searches for records based on provided criteria.
   * POST /api/v1/{objectName}/search
   */
  async searchRecords(
    objectName: string,
    searchParams: SearchRecordsRequest,
  ): Promise<SearchRecordsResponseData> {
    const response = await this.axiosInstance.post<
      ApiResponse<SearchRecordsResponseData>
    >(`/api/v1/${encodeURIComponent(objectName)}/search`, searchParams);
    return this.handleResponse<SearchRecordsResponseData>(response);
  }

  /**
   * Retrieves a single record by ID.
   * GET /api/v1/{objectName}/{id}
   */
  async getRecord(params: GetRecordParams): Promise<GetRecordResponseData> {
    const { objectName, id, fields } = params;
    const response = await this.axiosInstance.get<
      ApiResponse<GetRecordResponseData>
    >(`/api/v1/${encodeURIComponent(objectName)}/${encodeURIComponent(id)}`, {
      params: {
        fields,
      },
    });
    return this.handleResponse<GetRecordResponseData>(response);
  }

  /**
   * Updates a record by ID.
   * PUT /api/v1/{objectName}/{id}
   */
  async updateRecord(
    params: UpdateRecordParams,
  ): Promise<UpdateRecordResponseData> {
    const { objectName, id, doc } = params;
    const response = await this.axiosInstance.put<
      ApiResponse<UpdateRecordResponseData>
    >(`/api/v1/${encodeURIComponent(objectName)}/${encodeURIComponent(id)}`, {
      doc,
    });
    return this.handleResponse<UpdateRecordResponseData>(response);
  }

  /**
   * Deletes a record by ID.
   * DELETE /api/v1/{objectName}/{id}
   */
  async deleteRecord(
    params: DeleteRecordParams,
  ): Promise<DeleteRecordResponseData> {
    const { objectName, id } = params;
    const response = await this.axiosInstance.delete<
      ApiResponse<DeleteRecordResponseData>
    >(`/api/v1/${encodeURIComponent(objectName)}/${encodeURIComponent(id)}`);
    return this.handleResponse<DeleteRecordResponseData>(response);
  }

  /**
   * Downloads a file by its ID.
   * GET /api/files/files/{fileId}
   */
  async downloadFile(params: DownloadFileParams): Promise<Blob> {
    const { fileId } = params;
    const response = await this.axiosInstance.get(
      `/api/files/files/${encodeURIComponent(fileId)}`,
      {
        responseType: "blob",
      },
    );
    return response.data;
  }

  /**
   * Uploads a file.
   * POST /s3/files/
   */
  async uploadFile(file: File): Promise<UploadFileResponseData> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.axiosInstance.post<
      ApiResponse<UploadFileResponseData>
    >(`/s3/files/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return this.handleResponse<UploadFileResponseData>(response);
  }
}
const api = new ServiceRecordsApi(
  "http://127.0.0.1:5100/",
  "your_api_key_here",
);
