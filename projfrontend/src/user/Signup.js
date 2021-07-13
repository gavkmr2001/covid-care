import React, {useState} from "react"
import Base from "../core/Base"
import { Link } from "react-router-dom"
import { signup } from "../auth/helper";

const Signup = () => {

    const [values, setValues] = useState({
        name: "",
        email: "",
        password : "",
        error: "",
        success: false
    });
    
    //destructuring --so that use value.name as name
    const {name, email, password, error, success} = values

    //functional programming --higher order functions
    const handleChange = name => event => { //passing name value in event
        setValues({...values, error: false, [name]: event.target.value})
    };

    const onSubmit = event => {
        event.preventDefault()
        setValues({...values, error: false})
        signup({name, email, password})
        .then(data => {
            if(data.error){
                setValues({...values, error: data.error, success: false})
            } else {
                setValues({
                    ...values,
                    //reseting all the values
                    name: "",
                    email: "",
                    password: "",
                    error: "",
                    success: true
                });
            }
        })
        .catch(console.log("error in signup"));
    };


    const signUpForm = () => { //method
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form action="">
                        <div className="form-group">
                            <label className="text-light">Name</label>
                            <input 
                                className="form-control" 
                                type="text"
                                onChange= {handleChange("name")}
                                value= {name}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input 
                                className="form-control" 
                                type="email"
                                onChange= {handleChange("email")}
                                value= {email}
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input 
                                className="form-control" 
                                type="password"
                                onChange= {handleChange("password")}
                                value= {password}
                            />
                        </div>
                        <button onClick={onSubmit} className="btn btn-success btn-block">Submit</button>
                    </form>
                </div>
            </div>
        )
    };

    const successMessage = () => {
        return (

            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-success"
                    style= {{display: success? "": "none"}}
                    >
                        New account was created successfully. Please 
                        <Link to="/signin">Login Here</Link>
                    </div>
                </div>
            </div>
            
        );
    }

    const errorMessage = () => {
        return (

            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger"
                    style= {{display: error ? "": "none"}}
                    >
                    {error}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <Base title="Sign up Page" description="User can signup">
            {successMessage()}
            {errorMessage()}
            {signUpForm()} 
        </Base>
    )
}

export default Signup;

//state --where to store all data that is coming from the form 
//before submitting it to the backend 



