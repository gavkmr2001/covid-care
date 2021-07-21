import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import Base from "../core/Base";
import { deleteProduct, getProducts } from './helper/adminapicall';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);

    const {user, token} = isAuthenticated();

    //stuffs to be preloaded
    const preload = () => {
        getProducts().then(data => {
            if (data.error){
                console.log(data.error);
            } else {
                setProducts(data);
            }
        });
    };

    //calling the preload
    useEffect(() => {
        preload();
    }, []);


    const deleteThisProduct = productId => { //we r passing productId  
        deleteProduct(productId, user._id, token).then(data => { //imported user and token from isAuthrnticated        
            if(data?.error){
                console.log(data.error);
            } else {
                preload(); //delete then reload the page
            }
        });
    };

    return (
        <Base title="Welcome admin" description="Manage products here">
            <Link className="btn btn-info" to={`/admin/dashboard`}>
                <span className="">Admin Home</span>
            </Link>
            <h2 className="mb-4">All products:</h2>
            <div className="row">
                <div className="col-12">
                    { products.map((product, index) => {
                        //console.log(product)
                        return (
                            <div key={index} className="row text-center mb-2 ">
                                <div className="col-4">
                                    <h3 className="text-white text-left">{product.name}</h3>
                                </div>
                                <div className="col-4">
                                    <Link
                                        className="btn btn-success"
                                        to={`/admin/product/update/${product._id}`} //because we r inside loop
                                    >
                                        <span className="">Update</span>
                                    </Link>
                                </div>
                                <div className="col-4">
                                    <button onClick={() => { //we pass a parameter in deleteThisProduct..so we have to do like this
                                        deleteThisProduct(product._id)
                                    }} className="btn btn-danger">
                                        Delete
                                    </button>
                                </div>
                            </div>
                            );
                    })}

                </div>
            </div>
        </Base>
    );
};

export default ManageProducts;
//make an entry in the routes

