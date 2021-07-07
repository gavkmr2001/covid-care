import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from '../core/Base'
import { deleteCategory, getCategories} from "./helper/adminapicall";




const ManageCategories = () => {
    const [categories, setCategories] = useState([]);

    const {user, token} = isAuthenticated();

    //stuffs to be preloaded
    const preload = () => {
        getCategories().then(data => {
            if (data.error){
                console.log(data.error);
            } else {
                setCategories(data);
            }
        });
    };

    //calling the preload
    useEffect(() => {
        preload();
    }, []);

    const deleteThisCategory = categoryId => { //we r passing productId  
        deleteCategory(categoryId, user._id, token).then(data => { //imported user and token from isAuthrnticated        
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
            <h2 className="mb-4">All categories:</h2>
            <div className="row">
                <div className="col-12">
                    <h2 className="text-center text-white my-3">Total 3 categories</h2>
                    { categories.map((category, index) => {
                        //console.log(category)
                        return (
                            <div key={index} className="row text-center mb-2 ">
                                <div className="col-4">
                                    <h3 className="text-white text-left">{category.name}</h3>
                                </div>
                                <div className="col-4">
                                    <Link
                                        className="btn btn-success"
                                        to={`/admin/category/update/${category._id}`} //because we r inside loop
                                    >
                                        <span className="">Update</span>
                                    </Link>
                                </div>
                                <div className="col-4">
                                    <button onClick={() => { //we pass a parameter in deleteThisCategory..so we have to do like this
                                        deleteThisCategory(category._id)
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
    )
}

export default ManageCategories;