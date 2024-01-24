const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  return 1400;
};

app.post("/create-payment", async (req, res) => {
  const { items } = req.body;

  /*
     If you have two or more “business_country” + “business_label” pairs configured in your Hyperswitch dashboard,
     please pass the fields business_country and business_label in this request body.
     For accessing more features, you can check out the request body schema for payments-create API here :
     https://api-reference.hyperswitch.io/docs/hyperswitch-api-reference/60bae82472db8-payments-create
  */

  const hyperswitch_url = "https://beta.hyperswitch.io/api/payments";
  // const hyperswitch_api_key = "snd_c691ade6995743bd88c166ba509ff5da"; // Replace with your actual API key provided by Hyperswitch
  const hyperswitch_api_key =
    "snd_eTCKPWs6pkiroOiFgTLOKa9117gN8mbI3XlrlL4f1WYWIBOJUkxFwLKuDxumQ7i4"; // Replace with your actual API key provided by Hyperswitch

  const payload = {
    currency: "USD",
    amount: 2999,
    order_details: [
      {
        product_name: "Apple iphone 15",
        quantity: 1,
        amount: 2999,
      },
    ],
    currency: "USD",
    confirm: false,
    capture_method: "automatic",
    authentication_type: "three_ds",
    customer_id: "hyperswitch_sdk_demo_id",
    email: "hyperswitch_sdk_demo_id@gmail.com",
    description: "Hello this is description",
    // allowed_payment_method_types:["sofort"],
    shipping: {
      address: {
        state: null,
        city: null,
        country: "US",
        line1: "sdsdfsdf",
        line2: null,
        line3: null,
        zip: null,
        first_name: "joseph",
        last_name: "doe",
      },
      phone: {
        number: null,
        country_code: null,
      },
    },
    connector_metadata: {
      noon: {
        order_category: "applepay",
      },
    },
    metadata: {
      udf1: "value1",
      new_customer: "true",
      login_date: "2019-09-10T10:11:12Z",
    },
    business_country: "US",
    business_label: "default",
    billing: {
      address: {
        state: null,
        city: null,
        country: "US",
        line1: "sdsdfsdf",
        line2: null,
        line3: null,
        zip: null,
        first_name: "joseph",
        last_name: "doe",
      },
      phone: {
        number: null,
        country_code: null,
      },
    },
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "api-key": hyperswitch_api_key,
  };

  try {
    const response = await fetch(hyperswitch_url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);
    res.send({
      client_secret: data.client_secret,
    });
  } catch (error) {
    res.send({
      error: error.message || "Unknown error occurred",
    });
  }
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
