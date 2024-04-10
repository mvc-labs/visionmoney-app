import type { AxiosResponse, AxiosRequestConfig } from "axios";
const axios = require("axios");
export default class HttpRequest {
  request;
  constructor(
    baseUrl: string,
    params?: {
      header?: { [key: string]: any }; 
      errorHandel?: (error: any) => Promise<any>; 
      responseHandel?: (response: AxiosResponse) => Promise<any>; 
      timeout?: number;
      timeoutErrorMessage?: string;
    }
  ) {
    this.request = axios.create({
      baseURL: baseUrl,
      timeout: params?.timeout ? params?.timeout : 30000,
      timeoutErrorMessage: params?.timeoutErrorMessage
        ? params?.timeoutErrorMessage
        : "",
    });
    this.request.interceptors.request.use(
      async (config: AxiosRequestConfig<any>) => {
        if (params?.header) {
          let header;
          if (typeof params.header === "function")
            header = await params.header(config);
          else header = params.header;

          for (const i in header) {
            if (!config.headers) {
              // @ts-ignore
              config.headers = {};
            }
            if (typeof header[i] === "function") {
              config.headers[i] = header[i]();
            } else {
              config.headers[i] = header[i];
            }
          }
        }

        return config;
      },
      function (error: any) {
        return Promise.reject(error);
      }
    );
    this.request.interceptors.response.use(
      async function (response: any) {
        if (params?.responseHandel) {
          return await params.responseHandel(response);
        } else {
          return response.data;
        }
      },
      function (error: any) {
        if (params?.errorHandel) {
          return params.errorHandel(error);
        } else {
          return Promise.reject(error);
        }
      }
    );
  }
}
