import axios from "axios";

const GetHeaderRequest = pToken => {

    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pToken}`
    }
};

const GetHeaderRequestFormData = pToken => {
    return {
        'Authorization': `Bearer ${pToken}`
    }
};


const GetResponseBody = pResponse => {
    const contentType = pResponse.headers["content-type"];
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return pResponse.data;
    } else {
        return null;
    }
};

export const GetToken = async () => {
    const data = { username: 'sarah', password: 'connor' };

    const result = await axios.post('http://localhost:8081/auth', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' }, });
    return await GetResponseBody(result);
}

export const GetMembers = async (pToken) => {    
    const result = await axios.get('http://localhost:8081/api/members', { headers: GetHeaderRequestFormData(pToken) });
    return await GetResponseBody(result);
}

export const InsertMember = async (pToken, pData) => {    
    const result = await axios.post('http://localhost:8081/api/members', JSON.stringify(pData), { headers: GetHeaderRequest(pToken) });
    return await GetResponseBody(result);
}