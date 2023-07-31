const express = require("express");
const app = express();

const hyperswitch = require("@juspay-tech/hyperswitch-node")('HYPERSWITCH_API_KEY');

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  return 1345;
};

app.post("/create-payment", async (req, res) => {

  const { items } = req.body;

  /*
     If you have two or more “business_country” + “business_label” pairs configured in your Hyperswitch dashboard,
     please pass the fields business_country and business_label in this request body.
     For accessing more features, you can check out the request body schema for payments-create API here :
     https://api-reference.hyperswitch.io/docs/hyperswitch-api-reference/60bae82472db8-payments-create
  */

  const paymentIntent = await hyperswitch.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "USD",
  });

  res.send({
    client_secret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
