import axios from 'axios';

export default class BaseRequest {
    headers: any;
    options: any;
    constructor() {
        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        this.options = {
            method: 'GET',
            headers: this.headers
        };
    }

    /**
     * 设置请求头
     * @param headers
     * @returns {BaseRequest}
     */
    setHeader(headers){
        for (const header in headers) {
            if (headers.hasOwnProperty(header)) {
                this.options.headers[header] = headers[header];
            }
        }
        return this;
    }

    setHeaderCode(name) {
        let headers;
        switch (name) {
            case 'form':
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
                break;
            case 'json':
                headers = {
                    'Content-Type': 'application/json'
                };
                break;
            case 'xml':
                headers = {
                    'Content-Type': 'application/xml'
                };
                break;
        }
        this.setHeader(headers);
        return this;
    }

    /**
     *
     * @param method
     * @param url
     * @param params
     * @returns {Promise<T>}
     */
    request(method, url, params?) {
        return new Promise((resolve, reject) => {
            if (typeof params !== 'object') {
                params = {};
            }
            let options = {
                timeout: 30000,
                params: null,
                headers: null,
                //withCredentials: true, //是否携带cookies发起请求
                validateStatus: (status) => {
                    return status >= 200 && status < 300;
                },
                ...{
                    ...this.options,
                    ...params,
                    method,
                    url
                }
            };
            axios.request(options).then(res => {
                resolve(typeof res.data === 'object' ? res.data : JSON.parse(res.data))
            }, error => {
                if (error.response) {
                    reject(error.response.data)
                } else {
                    reject(error)
                }
            });
        })
    }

    /**
     * get
     * @param url
     * @param params
     * @returns {Promise<T>}
     */
    async get(url, params) {
        return await this.request('GET', url, params);
    }

    /**
     * post
     * @param url
     * @param params
     * @returns {Promise<T>}
     */
    async post(url, params) {
        return await this.request('POST', url, params);
    }

    /**
     * delete
     * @param url
     * @param params
     * @returns {Promise<T>}
     */
    async delete(url, params) {
        return await this.request('DELETE', url, params);
    }

    /**
     * put
     * @param url
     * @param params
     * @returns {Promise<T>}
     */
    async put(url, params) {
        return await this.request('PUT', url, params);
    }
}