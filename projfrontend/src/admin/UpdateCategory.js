import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Base from '../core/Base'
import {   getCategory, updateCategory } from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper';

//extract things from the url ==match..
const UpdateCategory = ({match}) => {
    
    const {user, token} = isAuthenticated();


    const [values, setValues ] = useState({
        // name: "",
        // description: "",
        // price: "",
        // stock: "",
        // photo: "",
        // categories: [],
        category: "",
        loading: false,
        error: "",
        //createdProduct: "",
        getaRedirect: false,
        formData: ""
    });
  
    const { loading, error, category,  getaRedirect, formData} = values;


    
    const preload = (categoryId) => {
        getCategory(categoryId).then(data => { 
        //   console.log(data);
          if(data.error) {
              setValues({...values, error: data.error});
          } else {
                setValues({ 
                  ...values,
                  //loading the previous data from the db
                  category: data.name,              
                  formData: new FormData()
                  
              });
              //console.log(formData);
          }
        });
    };


    useEffect(() => {
        preload(match.params.categoryId); //needed a parameter productId in preload
        //that is why we r using match
      } , []);


    // const handleChange= name => event => {
    // const value= event.target.value 
    // formData.set(name, value); //set form with its name and values
    // setValues({...values, [name]: value})
    // };

    const handleChange= name => event => {
        const value= event.target.value 
        formData.set(name, value); //set form with its name and values
        //console.log(name, value)
        setValues({...values, [name]: value})
        //console.log(name, value)
    };


    const onSubmit = (event) => {
        event.preventDefault(); //default submission prevented
        setValues({...values, //load all the existing values 
          error: "", //delete/refresh previous errors
          loading: true
        })


         //method
        updateCategory(match.params.categoryId ,user._id ,token, category).then(data => {
        // console.log(match.params.categoryId)
        // console.log(category)
        if(data.error){
          setValues({...values, error: data.error}) //update errors
        } else{
          setValues({
            ...values,
            //name:"",
            // description: "",
            // price: "",
            // photo:"",
            // stock: "",
            category: data.name,
            loading:false,
            //createdProduct: data.name
            // getaRedirect: true
          })
        }
      })
    } 

    


    const myCategoryForm = () => (
        <form>
            <div className="form-group">
                <p className="lead">Update your Category here</p>
                <input type="text"
                    className ="form-control my-3"
                    onChange= {handleChange("category")} //handleChange is method
                    value= {category}
                    autoFocus
                    required
                    //placeholder="For Ex. Summer"
                />
                <button  onClick={onSubmit} className="btn btn-outline-info">Update Category</button>
            </div>
        </form>
    );
    
    
    return (
        <Base
        title= "Update Category"
        description="Welcome to category updation section"
        className="bg-info container p-4"
        >
        <Link
            to="/admin/categories"
            className="btn btn-md btn-dark mb-3 "
        >
            All Categories
        </Link>
        <div className="row bg-dark text-white rounded">
            <div className="col-md-8 offset-md-2">
                {myCategoryForm()}
            </div>
        </div>
        </Base>
    );
};

export default UpdateCategory;