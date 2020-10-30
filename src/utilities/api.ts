import { environment } from "../environments/environment";

const baseUrl = environment.server.replace(/\/+$/, "");

const ajax = (method: string) => async (url: string): Promise<any> => {
    url = `${baseUrl}/${url.replace(/^\/+/, "")}`
    try {
        const res1 = await fetch(url, {
            method: method,
            credentials: "include"
        });

        const res2 = await res1.json();
        return res2;
    }
    catch (e) {
        return e;
    }
}

const ajaxBody = (method: string) => async (url: string, body: any): Promise<any> => {
    url = `${baseUrl}/${url.replace(/^\/+/, "")}`
    try {
        const res1 = await fetch(url, {
            method: method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const res2 = await res1.json();
        return res2;
    }
    catch (e) {
        return e;
    }
}

const get = ajax("GET");
const del = ajax("DELETE");
const post = ajaxBody("POST");
const patch = ajaxBody("PATCH");

export const createUser = async (username: string, firstName: string, lastName: string, emailAddress: string, password: string) => {
    return await post("/Users", {username, firstName, lastName, emailAddress, password});
};

export const queryUser = async (username: string) => {
    return await get(`/Users/${username}`);
};

export const queryUsers = async () => {
    return await get(`/Users`);
};

export const updateUser = async (username: string, update: Partial<{firstName: string, lastName: string, emailAddress: string, password: string}>) => {
    return await patch("/Users", {...update, username});
};

export const deleteUser = async (username: string) => {
    return await del(`/Users/${username}`);
};

export const authenticateUser = async (username: string, password: string) => {
    return await get(`/Users/${username}/${password}`);
};