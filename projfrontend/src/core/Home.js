import React, {useState, useEffect} from 'react'
import "../styles.css";
import {API } from "../backend"; //connecting frontend to backend
import Base from "./Base";
import Card from './Card';
import { getProducts } from './helper/coreapicalls';


export default function Home() {
  console.log("API IS", API); //connecting frontend to backend
  
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  //method
  const loadAllProduct = () => {
    getProducts().then(data => {
      if(data && data.error){
        setError(data.error);
      } else{
        setProducts(data);
      }
    });
  }

  //for running the method loadAllProducts
  useEffect(() => {
    loadAllProduct();
  }, []);

  return (
    // can overwrite value given in Base
      <Base title="Covid Care" description="Accessories Store">
        <div className="row text-center">
          <h1 className="text-dark">All Products</h1>
          <div className="row">
            {products && products.map((product, index) => {
              return(
                //repeat itself ...
                <div key={index} className="col-md-4 mb-4">
                  <Card product={product}  /> 
                </div>
              )
            })}
          </div>         
        </div>
      </Base>
  );
}

