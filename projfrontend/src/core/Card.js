import React , {useState, useEffect} from 'react'
import { Redirect } from 'react-router-dom';
import { addItemToCart, removeItemFromCart } from './helper/cartHelper';
import ImageHelper from './helper/ImageHelper';

//reusable component
const Card = ({ 
  product, 
  addtoCart = true, 
  removefromCart = false , 
  setReload = f => f, //function(f)(return f) ie, whatever we r passing just return that
  reload = undefined
}) => {
    
  const [redirect, setRedirect] = useState(false); //for redirect ..default= false
  const [count, setCount] = useState(product.count) //count property on product

  //if product is present then extract info from the product 
  //else default info
  const cartTitle = product ? product.name : "default title"
  const cartDescription = product ? product.description : "default description"
  const cartPrice = product ? product.price : "default price"

  const addToCart = () =>{
    //we are using a callback because we put a next in the additemtocart method
    addItemToCart(product , () => setRedirect(true)); //Redirect set to true
  };


  const getARedirect = redirect => {
    if(redirect) {
      return <Redirect to ="/cart" />;
    }
  };

  //method
  const showAddToCart = (addtoCart) => {
      return (
          addtoCart && (
              <button
              onClick={addToCart}
              className="btn btn-block btn-outline-success mt-2 mb-2"
            >
              Add to Cart
            </button>
          )
      )
  };


    const showRemoveFromCart = (removefromCart) => {
        return (
            removefromCart && (
                <button
                onClick={() => {
                  removeItemFromCart(product._id);
                  setReload(!reload); //reload after removing the item
                }}
                className="btn btn-block btn-outline-danger mt-2 mb-2"
              >
                Remove from cart
              </button>
            )
        )
    };
    
    
    return (
      <div className="card text-white bg-dark border border-info ">
        <div className="card-header lead text-uppercase">{cartTitle}</div>
        <div className="card-body">
          {getARedirect(redirect)}
          <ImageHelper product= {product} />
          <p className="lead bg-success font-weight-normal text-wrap">
            {cartDescription}
          </p>
          <p className="btn btn-success rounded  btn-sm px-4">$ {cartPrice}</p>
          <div className="row">
            <div className="col-12">
              {showAddToCart(addtoCart)}
            </div>
            <div className="col-12">
              {showRemoveFromCart(removefromCart)}
            </div>
          </div>
        </div>
      </div>
    );
  };


//made a separarte file ImageHelper.js for images
export default Card;