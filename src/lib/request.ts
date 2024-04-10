import HttpRequest2 from 'request-sdk'


export default class HttpRequest {
  request
  constructor(
    baseUrl: string,
    params?: {
      header?: { [key: string]: any } 
      errorHandel?: (error: any) => Promise<any> 
      responseHandel?: (response: any) => Promise<any> 
      timeout?: number
      timeoutErrorMessage?: string
    }
  ) {
    this.request = new HttpRequest2(baseUrl, {
      // @ts-ignore
      timeoutErrorMessage: ('Request Timeout'),
      ...params,
    }).request
  }
}
