//put evrything into the cart and local storage

//we will redirect to another page so we need next
export const addItemToCart = (item, next) => { //need a  callback so use next
    let cart = []; //cart object
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){ //if there is any existig cart
            cart = JSON.parse(localStorage.getItem("cart")) //put that cart into a temporary holder
        }
        cart.push({
            ...item, //load all items and push into cart
            count: 1
        })
        localStorage.setItem("cart", JSON.stringify(cart)) //updating cart
        next()
    }
}

export const loadCart = () => {
    if(typeof window !== undefined) {
        if(localStorage.getItem("cart")){ //if there is any existig cart
            return JSON.parse(localStorage.getItem("cart")) //put that cart into a temporary holder
        }
    }
};

export const removeItemFromCart = (productId) => {
    let cart = [] //cart object
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){ //if there is any existig cart
            cart = JSON.parse(localStorage.getItem("cart")) //put that cart into a temporary holder
        }
        cart.map((product, i) => { // i = index
            if(product._id === productId){
                cart.splice(i, 1) //delete 1 item starting from index i
            }
        }) 
        localStorage.setItem("cart", JSON.stringify(cart)) //updating cart
    }
    return cart;
};


export const cartEmpty = next => {
    if(typeof window !== undefined){
        localStorage.removeItem("cart")
        //WE cant remove the cart as it will crash the application
        let cart = []
        //instead update the value and make the cart empty
        localStorage.setItem("cart", JSON.stringify(cart)); //updating cart
        next();
    }
}