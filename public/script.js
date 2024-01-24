//Follow this doc for HTML and REST API integration: https://hyperswitch.io/docs/sdkIntegrations/unifiedCheckoutWeb/restAPIBackendAndHTMLFrontend
// Update your publishable key here

var items = [{ id: "xl-tshirt" }];

var appearance = {
  variables: {
    colorPrimary: "rgb(0, 109, 249)",
    fontFamily: "Work Sans, sans-serif",
    fontSizeBase: "16px",
    colorText: "rgb(51, 65, 85)",
    colorTextSecondary: "#334155B3",
    colorPrimaryText: "rgb(51, 65, 85)",
    colorTextPlaceholder: "#33415550",
    borderColor: "#33415550",
    colorBackground: "rgb(255, 255, 255)",
  },
};

var widgets;
var style;
var unifiedCheckoutOptions;
var unifiedCheckout;
var client_secret;
var hyper;

async function initialize() {
  hyper = Hyper("pk_snd_5c737872e3794b6fa1980da7ea890451");
  // For demo purpose we are calling the hyperswitch API directly here, but in actual setup this should be backend call to your server and call the hyperswitch API internally with your API key
  var response = await fetch("/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  var { client_secret } = await response.json();

  // You can change the apperance of the SDK by adding field here

  async function sdkHandleOneClickPayment(e) {
    setLoading(true);
    console.log("Pre Handle");
    var { error, data, status } = await hyper.oneClickConfirmPayment(
      {
        redirect: "always",
        confirmParams: {
          return_url: "https://example.com/complete?fallback=true",
        },
      },
      true
    );
    console.log(error, "error");
    console.log(data, "data");
    console.log(status, "status");

    // This point will only be reached if there is an immediate error occurring while confirming the payment. Otherwise, your customer will be redirected to your `return_url`.

    // For some payment flows such as Sofort, iDEAL, your customer will be redirected to an intermediate page to complete authorization of the payment, and then redirected to the `return_url`.

    if (error && error.type === "validation_error") {
      showMessage(error.message);
    } else if (status === "succeeded") {
      addClass("#hypers-sdk", "hidden");
      removeClass("#orderSuccess", "hidden");
    } else {
      showMessage("An unexpected error occurred.");
    }

    setLoading(false);
  }

  widgets = hyper.widgets({
    appearance,
    clientSecret: client_secret,
  });

  style = {
    theme: "dark",
  };

  unifiedCheckoutOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: !1,
      radios: !0,
      spacedAccordionItems: !0,
      maxLength: -1,
    },
    wallets: {
      walletReturnUrl: "https://example.com/complete?wallet=true",
      style: style,
    },
    sdkHandleOneClickConfirmPayment: false,
  };

  unifiedCheckout = widgets.create("payment", unifiedCheckoutOptions);
  unifiedCheckout.mount("#unified-checkout");
  unifiedCheckout.on("confirmTriggered", function (event) {
    console.log("confirmTriggered");
    console.log(event);
  });
  unifiedCheckout.on("oneClickConfirmTriggered", function (event) {
    console.log("oneClickConfirmTriggered");
    console.log(event);
    sdkHandleOneClickPayment();
  });
}
initialize();

async function handleSubmit(e) {
  setLoading(true);
  var { error, data, status } = await hyper.confirmPayment({
    widgets,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "https://example.com/complete",
    },
  });

  // This point will only be reached if there is an immediate error occurring while confirming the payment. Otherwise, your customer will be redirected to your `return_url`.

  // For some payment flows such as Sofort, iDEAL, your customer will be redirected to an intermediate page to complete authorization of the payment, and then redirected to the `return_url`.

  if (error && error.type === "validation_error") {
    showMessage(error.message);
  } else if (status === "succeeded") {
    addClass("#hypers-sdk", "hidden");
    removeClass("#orderSuccess", "hidden");
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment status after payment submission
async function checkStatus() {
  var clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  var { payment } = await hyper.retrievePayment(clientSecret);

  switch (payment.status) {
    case "succeeded":
      showMessage("Payment succeeded!");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      break;
    default:
      showMessage("Something went wrong.");
      break;
  }
}

function setLoading(showLoader) {
  if (showLoader) {
    show(".spinner");
    hide("#button-text");
  } else {
    hide(".spinner");
    show("#button-text");
  }
}

function show(id) {
  removeClass(id, "hidden");
}
function hide(id) {
  addClass(id, "hidden");
}

function showMessage(msg) {
  show("#payment-message");
  addText("#payment-message", msg);
}

function addText(id, msg) {
  var element = document.querySelector(id);
  element.innerText = msg;
}

function addClass(id, className) {
  var element = document.querySelector(id);
  element.classList.add(className);
}

function removeClass(id, className) {
  var element = document.querySelector(id);
  element.classList.remove(className);
}

function retryPayment() {
  hide("#orderSuccess");
  show(".Container");
  initialize();
}

function showSDK(e) {
  hide(".Container");
  show("#hypers-sdk");
}

showSDK();
