import axios from "axios";
export function createBatchHttpClient(
    baseUrl: string
) {
    return axios.create({
        baseURL: baseUrl,
        timeout: 5000,
    });
}