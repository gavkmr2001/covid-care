import React, {useState, useEffect} from 'react'
import "../styles.css";
import {API } from "../backend"; //connecting frontend to backend
import Base from "./Base";
import Card from './Card';
import { loadCart } from './helper/cartHelper';
// import StripeCheckout from './StripeCheckout';
import Paymentb from "./Paymentb";


const  Cart = () => {
  
  const [products, setProducts] = useState([]);

  //forcefully remount the page or reload the page --method
  const [reload, setReload] = useState(false); //for reload ..default= false
  

    useEffect(() => {
        setProducts(loadCart());
    }, [reload]); //forcefully reloads the page after any product is removed from the cart


    const loadAllProducts = (products) => {
        return(
            <div >
            <h2 className="text-white"> this section is to load products</h2>
                {products && products.map((product, index) => (
                    <Card 
                        key= {index}
                        product= {product}
                        removefromCart = {true}
                        addtoCart = {false}
                        setReload = {setReload}
                        reload = {reload}
                    />
                ))}
            </div>
        )
    }


    const loadCheckout = () => {
        return(
            <div>
                <h2>loadCheckout</h2>
            </div>
        )
    }


  return (
    // can overwrite value given in Base
      <Base title="Cart page" description="Ready to checkout">
        <div className="row text-center">
            <div className="col-md-6">
                {products.length >0 ? (
                    loadAllProducts(products)
                    ): (
                    <h3>No Products in Cart</h3>
                )}
            </div>
            <div className="col-md-6">
                <Paymentb products={products} setReload = {setReload} />
            </div>
        </div>
      </Base>
  );
}

export default Cart;