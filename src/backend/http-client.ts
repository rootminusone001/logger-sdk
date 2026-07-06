import axios from "axios";
import http from "http";
import https from "https";

export function createHttpClient(
    baseUrl: string
) {
    return axios.create({
        baseURL: baseUrl,
        timeout: 5000,

        httpAgent: new http.Agent({
            keepAlive: true,
            maxSockets: 50,
        }),

        httpsAgent: new https.Agent({
            keepAlive: true,
            maxSockets: 50,
        }),
    });
}
