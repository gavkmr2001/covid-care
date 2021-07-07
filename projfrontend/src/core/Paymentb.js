import React, { useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { cartEmpty, loadCart } from './helper/cartHelper';
import { createOrder } from './helper/orderHelper';
import { getmeToken, processPayment } from './helper/paymentbhelper';
import { isAuthenticated } from "../auth/helper";
import DropIn from "braintree-web-drop-in-react";


const Paymentb = ({products, setReload = f => f , reload = undefined}) => {
    
    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    });
    
    //extracting userId and token from isAuthenticated
    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    
    //use token and userId here 
    const getToken = (userId, token) => {
        // console.log("userid", userId);
        // console.log("tokenn", token);
        getmeToken(userId, token).then(info => {
            console.log("information", info);
            if(info && info.error) {
                setInfo({...info, error: info.error})
            } else {
              if (info !== undefined) {
                const clientToken = info.clientToken;
                setInfo({clientToken});
              }
            }
        })
    }


    const showbtdropIn = () => {
        return (
          <div>
            {info.clientToken !== null && products.length > 0 ? (
              <div>
                <DropIn
                  options={{ authorization: info.clientToken }}
                  onInstance={instance => (info.instance = instance)}
                />
                <button className="btn btn-block btn-success" onClick={onPurchase}>
                  Buy
                </button>
              </div>
            ) : (
              <h3>Please login or add something to cart</h3>
            )}
          </div>
        );
      };
    
      useEffect(() => {
        getToken(userId, token);
      }, []);
    
      //earlier code
      const onPurchase = () => {
        setInfo({ loading: true });
        let nonce;
        let getNonce = info.instance.requestPaymentMethod().then(data => {
                nonce = data.nonce;
                const paymentData = {
                paymentMethodNonce: nonce,
                amount: getAmount()
                };
                processPayment(userId, token, paymentData)
                    .then(response => {
                        setInfo({ ...info, success: response.success, loading: false });
                        console.log("PAYMENT SUCCESS");
                        const orderData = {
                          products: products,
                          transaction_id: response.transaction.id, //backend >> models
                          amount: response.transaction.amount
                        };
                        createOrder(userId, token, orderData);
                        // empty the cart
                        cartEmpty(() => {
                          console.log("Did we got a crash")
                        })
                        //TODO: force reload
                        setReload(!reload);
                    })
                    .catch(error => {
                        setInfo({ loading: false, success: false });
                        console.log("PAYMENT FAILED");
                    });
            });
      };
      
      //later code==============
    //   const onPurchase = () => {
    //     setInfo({ loading: true });
    //     let nonce=null;
    //     let getNonce = info?.instance?.requestPaymentMethod().then(data => {
    //       nonce = data?.nonce;
    //       const paymentData = {
    //         paymentMethodNonce: nonce,
    //         amount: getAmount()
    //       };
    //       processPayment(userId, token, paymentData)
    //                 .then(response => {
    //                     setInfo({ ...info, success: response.success, loading: false });
    //                     console.log("payment success");
    //                     const orderData = {
    //                         products: products,
    //                         transaction_id: response.transaction.id,
    //                         amount: response.transaction.amount,
                            

    //                     };
    //                     createOrder(userId, token, orderData);

    //                     cartEmpty(() => {
    //                         console.log("APP CRASHED")
    //                     });
    //                     setReload(!reload);
    //                 })
    //                 .catch(err => {
    //                     setInfo({ loading: false, success: false });
    //                     console.log("payment failed");
    //             })
    //         })
    //         .catch()
        
    // }

      const getAmount = () => {
        let amount = 0;
        products.map(product => {
          amount = amount + product.price
        });
        return amount;
      };
    

    return(
        <div>
            <h3>Your bill is {getAmount()} $</h3>
            {showbtdropIn()}
        </div>
    );
};

export default Paymentb;