import axios, { HttpStatusCode } from 'axios';

class RequestHelper {
    public async get(url: string, params = {}, headers = {}) {
        let options = {};

        if (Object.keys(params).length > 0) {
            options['params'] = params;
        }

        if (Object.keys(headers).length > 0) {
            options['headers'] = headers;
        }

        const { data, status } = await axios.get(url, options);

        if (status == 200) {
            return data;
        }
    }

    public async post(url: string, postData = {}, headers = {}) {
        let options = {};

        if (Object.keys(headers).length > 0) {
            options['headers'] = headers
        }

        const { data, status } = await axios.post(url, postData, options);

        if (status == HttpStatusCode.Ok || status == HttpStatusCode.Created) {
            return data;
        }
    }
}

export default RequestHelper;
