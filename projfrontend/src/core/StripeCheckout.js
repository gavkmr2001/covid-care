import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/cartHelper';
//doesnot require any base because it is a stand alone component
import StripeCheckoutButton from "react-stripe-checkout"
import { API } from '../backend';
import { createOrder } from './helper/orderHelper';



const StripeCheckout = ({
    products, 
    setReload =  f => f , //function returns whatever is given
    reload = undefined
}) => {

    const [data, setData]= useState({
        loading: false,
        success: false,
        error: "",
        address: ""
    });

    const token = isAuthenticated() && isAuthenticated().token
    const userId = isAuthenticated() && isAuthenticated().user._id

    const getFinalAmount = () => {
        let amount= 0
        products.map(p => {
            amount = amount+ p.price
        })
        return amount
    }


    const makePayment = (token) => {
        const body= {
            token,
            products
        }
        const headers= {
            "Content-Type" : "application/json"
        }
        return fetch(`${API}/stripepayment`, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        }).then(response => {
            console.log(response);
            const {status} = response;
            console.log("STATUS", status);
            // cartEmpty();
            //call further methods
        })
        .catch(error => console.error(error));

    };

    const showStripeButton = () => {
        return isAuthenticated() ? (
            <StripeCheckoutButton
                //publishable keys are used here
                stripeKey= "pk_test_51I2zguHOaIQ2Dwcoq1tfaItBoCVxngemiAuByjMnvriF72qTn4lHtD6HiO5dYaPkNvyvpXRIkCEkSGrPu1ke7RYA00aHXEAaKG"
                token= {makePayment} //a method
                amount= {getFinalAmount() * 100}
                name="Buy Tshirts"
                shippingAddress
                billingAddress
            >
                <button className="btn btn-success">Pay with Stripe</button>
            </StripeCheckoutButton>
        ) : (
            <Link to="/signin">
                <button className="btn btn-warning">Signin</button>
            </Link>
        )
    }


    return(
        <div>
            <h3 className="text-white">StripeCheckout {getFinalAmount()}</h3>
            {showStripeButton()}
        </div>
    );
};

export default StripeCheckout;