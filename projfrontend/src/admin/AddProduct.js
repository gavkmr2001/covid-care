// import { cleanup } from '@testing-library/react';
import React, {useState, useEffect} from 'react'
// import { Link ,  Redirect} from 'react-router-dom'
import { Link } from 'react-router-dom'
import Base from '../core/Base'
import { createaProduct, getCategories } from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper';




const AddProduct = () => {


  const {user, token} = isAuthenticated();

  const [values, setValues ] = useState({
      name: "",
      description: "",
      price: "",
      stock: "",
      photo: "",
      categories: [],
      category: "",
      loading: false,
      error: "",
      createdProduct: "",
      getaRedirect: false,
      formData: ""
  });

  const {name, description, price, stock, photo, categories,
      category, loading, error, createdProduct, getaRedirect, formData
  } = values;

  const preload = () => {
      getCategories().then(data => {
        // console.log(data);
        if(data.error) {
            setValues({...values, error: data.error});
        } else {
            setValues({...values, categories: data, formData: new FormData() });
            // console.log("CATE:",categories); 
        }
      });
  };

  useEffect(() => {
      preload();
  } , []);

  const AddProduct = () => {

  }

  const onSubmit = (event) => {
    event.preventDefault(); //default submission prevented
    setValues({...values, //load all the existing values 
      error: "", //delete/refresh previous errors
      loading: true
    }) 
     //method
    createaProduct(user._id ,token, formData).then(data => {
      if(data.error){
        setValues({...values, error: data.error}) //update errors
      } else{
        setValues({
          ...values,
          name:"",
          description: "",
          price: "",
          photo:"",
          stock: "",
          loading:false,
          createdProduct: data.name
          // getaRedirect: true
        })
      }
    })
  }

  //handling the photos
  const handleChange= name => event => {
    const value= name === "photo" ? event.target.files[0] : event.target.value //if else
    formData.set(name, value); //set form with its name and values
    setValues({...values, [name]: value})
  };


const successMessage = () => (
  <div className="alert alert-success mt-3"
  style={{display : createdProduct ? "" : "none"}} //if createdProduct exists meaning no error , then display else "none"  
  >
    <h4>{createdProduct} created Successfully</h4>
  </div>
);

const errorMessage = () => (
  <div className="alert alert-danger mt-3"
  style={{display: !error ? "none" : ""}}
  >
    <h4>{error}</h4>
  </div>
);


  const createProductForm = () => (
    <form >
        <span>Post photo</span>
        <div className="form-group">
          <label className="btn btn-block btn-success">
            <input
              onChange={handleChange("photo")}
              type="file"
              name="photo"
              accept="image"
              placeholder="choose a file"
            />
          </label>
        </div>
        <div className="form-group">
          <input
            onChange={handleChange("name")}
            name="photo"
            className="form-control"
            placeholder="Name"
            value={name}
          />
        </div>
        <div className="form-group">
          <textarea
            onChange={handleChange("description")}
            name="photo"
            className="form-control"
            placeholder="Description"
            value={description}
          />
        </div>
        <div className="form-group">
          <input
            onChange={handleChange("price")}
            type="number"
            className="form-control"
            placeholder="Price"
            value={price}
          />
        </div>
        <div className="form-group">
          <select
            onChange={handleChange("category")}
            className="form-control"
            placeholder="Category"
          >
          <option>Select</option>
            {categories && 
              categories.map((cate, index) => (
                <option key={index} value={cate._id}>{cate.name}</option>
              ))
            }
            
          </select>
        </div>
        <div className="form-group">
          <input
            onChange={handleChange("stock")}
            type="number"
            className="form-control"
            placeholder="Quantity"
            value={stock}
          />
        </div>
        
        <button type="submit" onClick={onSubmit} 
          className="btn btn-outline-success mb-3">
          Create Product
        </button>
      </form>
    );

  return (
    <Base
          title= "Add a product here"
          description="Welcome to product creation section"
          className="bg-info container p-4"
      >
          <Link
              to="/admin/dashboard"
              className="btn btn-md btn-dark mb-3 "
          >
              Admin Home
          </Link>
          <div className="row bg-dark text-white rounded">
              <div className="col-md-8 offset-md-2">
                {successMessage()}
                {errorMessage()}
                {createProductForm()}
              </div>
          </div>
      </Base>
  )
}

export default AddProduct;