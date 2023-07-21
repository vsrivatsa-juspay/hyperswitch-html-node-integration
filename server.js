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

  const paymentIntent = await hyperswitch.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "USD",
    business_label: "default",
    business_country: "US",
  });

  res.send({
    client_secret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
