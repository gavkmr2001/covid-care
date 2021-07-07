const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "h6xcz5hydr6hh8z7",
  publicKey: "85qxsjb879hmpqvd",
  privateKey: "72ff9c62bcfdfe927d59b205c9aa30b1"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
       if(err) {
           res.status(500).send(err) //cant use json here
       } else {
           res.send(response);
       }
      });
}

exports.processPayment = (req, res) => {
    let nonceFromTheClient =  req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount

    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, 
      function(err, result){
          if(err){
              res.status(500).json(err);
          } else{
              res.json(result)
          }
      });
};