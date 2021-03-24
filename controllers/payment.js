const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "mntfbg6tgv9pvhp9",
  publicKey: "p6wb2wj6sgn3rhkk",
  privateKey: "76aefc008f2918a537fb3f8a1926b97f"
});

exports.getToken = (req,res) => {
    gateway.clientToken.generate({}, (err, response) => {
        // pass clientToken to your front-end
        if(err){
            res.status(500).send(err)
        }
        else{
            res.send(response)
        }
      });
}

exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.nonceFromTheClient
    let amount = req.body.amount;
    gateway.transaction.sale({
        amount: amount,
        paymentMethodNonce: nonceFromTheClient,
        
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
            res.status(500).json(err)
        }
        else{
            res.json(result)
        }
      });
}