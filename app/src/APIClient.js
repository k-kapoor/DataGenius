import axios from "axios";

axios.defaults.baseURL = process.env.BASE_URL;

// Handles logging in to the system
export async function login(data) {
    try {
        const response = await axios.post('/api/login', {
            name: data.name,
            password: data.password,
            avatar: data.avatar,
            rememberMe: data.rememberMe
        });
        return response;
    } catch (error) {
        return error;
    }
}

// Logging in with a cookie
export async function loginCookie() {
    try {
        const response = await axios.post('/api/login');
        return response;
    } catch (error) {
        return error;
    }
}

// Handles signing up, including confirmations for the email and password
export async function signup(data) {
    try {
        const response = await axios.post('/api/signup', {
            email: data.email,
            confEmail: data.confEmail,
            name: data.name,
            password: data.password,
            confPassword: data.confPassword
        });
        return response;
    } catch (error) {
        return error;
    }
}

// Handles logging out
export async function logout() {
    try{
        const response = await axios.post('/api/logout');
        return response;
    } catch (error) {
        return error;
    }
}

// Handles deleting a user
export async function deleteUser(username) {
    try{
        const response = await axios.delete('/api/users/' + username);
        return response;
    } catch (error) {
        return error;
    }
}

// Handles getting public information about a user
export async function getUser(username) {
    try{
        const response = await axios.get('/api/users/' + username);
        return response;
    } catch (error) {
        return error;
    }
}

// Handles getting public information about a user
export async function getAllUsers() {
    try{
        const response = await axios.get('/api/getAllUsers');
        return response;
    } catch (error) {
        return error;
    }
}

// Handles updating a user, currently supports the following "type"s:
//      - "Bio"
//      - "Avatar"
//      
export async function updateUser(username, data) {
    try{
        return await axios.put('/api/users/' + username, {
            type: data.type,
            content: data.content
        });
        
    } catch (error) {
        return error;
    }
}

export async function upload(csv) {
    let formData = new FormData();
    formData.append("file", csv);
    try{
        const response = await axios.post('/api/data/' + csv.filename, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;

    } catch (error) {
        console.error(error);
    }
}

export async function getData(name) {
    try {
        return await axios.get('/api/data/' + name);
    } catch (error) {
        console.error(error);
    }
}

export async function getAllData() {
    try{
        const response = await axios.get('/api/data/all');
        return response;
    } catch (error) {
        return error;
    }
}

/**
 * Get the metadata of a single dataset
 * @param {*} filename The filename of the dataset to get metadata for
 */
export async function getMetaData(filename) {
    try {
        const response = await axios.get('/api/metadata/' + filename);
        return response;
    } catch (error) {
        return error;
    }
}

export async function updateTags(filename, tags) {
    try {
        const response = await axios.put('/api/data/' + filename, {curation: tags});
        return response;
    } catch(error) {
        return error;
    }
}