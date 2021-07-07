import { API } from "../../backend"
//API means http://localhost:8000/api/

export const signup = user => {
    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    }) //fetch request
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err)); 
}


export const signin = user => {
    return fetch(`${API}/signin`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(user)
    }) //fetch request
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err)); 
}

//sets token in user browser
export const authenticate = (data, next) => {
    if(typeof window !== "undefined") {
    //jwt token set is user is successfully signedin 
        localStorage.setItem("jwt", JSON.stringify(data))
        next();
    } 
}

//removes that token from the browser
export const signout = next => { //callback
    if(typeof window !== "undefined") { //if user is signed in
        //deleting the jwt token
            localStorage.removeItem("jwt")
            next();

            //logging out user from the backend
            return fetch(`${API}/signout`, {
                method: "GET"
            })
            .then(response => console.log("signout success"))
            .catch(err => console.log(err))
        } 
};

//saving jwt and stuff in window

export const isAuthenticated = () => {
    if(typeof window == "undefined") {
       return false;
    }
    if (localStorage.getItem("jwt")) {
        //returning the jwt value...verify the value of tokens in frontend
        return JSON.parse(localStorage.getItem("jwt"));
    } else {
        return false;
    }
};

//state --where to store all data that is coming from the form 
//before submitting it to the backend 






