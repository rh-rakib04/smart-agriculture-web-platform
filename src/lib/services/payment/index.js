/**
 * SSLCommerz Payment Service
 * Handles all SSLCommerz gateway interactions
 */

import SSLCommerzPayment from "sslcommerz-lts";

const STORE_ID = process.env.SSLCOMMERZ_STORE_ID;
const STORE_PASSWORD = process.env.SSLCOMMERZ_STORE_PASSWORD;
const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === "true"; // false = sandbox
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * Initiate SSLCommerz payment session
 * @param {Object} options
 * @param {number}  options.amount       - Total amount in BDT
 * @param {string}  options.tranId       - Unique transaction ID you generate
 * @param {string}  options.productName  - Crop title
 * @param {string}  options.productCategory - Crop category
 * @param {Object}  options.customer     - { name, email, phone, address, city, postcode }
 * @returns {Promise<string>} GatewayPageURL to redirect user
 */
export async function initiateSSLCommerzPayment({
  amount,
  tranId,
  productName,
  productCategory,
  customer,
}) {
  if (!STORE_ID || !STORE_PASSWORD) {
    throw new Error(
      "SSLCommerz credentials are not set in environment variables.",
    );
  }

  const data = {
    total_amount: amount,
    currency: "BDT",
    tran_id: tranId,

    // Redirect URLs — all go to your Next.js API routes
    success_url: `${BASE_URL}/api/payments/success`,
    fail_url: `${BASE_URL}/api/payments/fail`,
    cancel_url: `${BASE_URL}/api/payments/cancel`,
    ipn_url: `${BASE_URL}/api/payments/webhook`, // IPN = server-to-server notify

    // Product info
    shipping_method: "NO",
    product_name: productName,
    product_category: productCategory || "Agriculture",
    product_profile: "general",

    // Customer info
    cus_name: customer.name || "Customer",
    cus_email: customer.email || "customer@example.com",
    cus_add1: customer.address || "Dhaka",
    cus_add2: customer.address || "Dhaka",
    cus_city: customer.city || "Dhaka",
    cus_state: customer.city || "Dhaka",
    cus_postcode: customer.postcode || "1000",
    cus_country: "Bangladesh",
    cus_phone: customer.phone || "01700000000",
    cus_fax: customer.phone || "01700000000",

    // Shipping (same as customer for digital/pickup)
    ship_name: customer.name || "Customer",
    ship_add1: customer.address || "Dhaka",
    ship_add2: customer.address || "Dhaka",
    ship_city: customer.city || "Dhaka",
    ship_state: customer.city || "Dhaka",
    ship_postcode: customer.postcode || 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, IS_LIVE);
  const apiResponse = await sslcz.init(data);

  if (!apiResponse?.GatewayPageURL) {
    throw new Error(
      apiResponse?.failedreason || "Failed to get SSLCommerz gateway URL",
    );
  }

  return apiResponse.GatewayPageURL;
}

/**
 * Validate IPN (Instant Payment Notification) from SSLCommerz
 * Always validate on server; never trust client-side success redirect alone.
 * @param {string} tranId
 * @param {number} amount
 * @param {string} currency
 * @returns {Promise<boolean>}
 */
export async function validateSSLCommerzIPN(tranId, amount, currency = "BDT") {
  const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, IS_LIVE);

  const response = await sslcz.validate({
    val_id: tranId,
    store_id: STORE_ID,
    store_passwd: STORE_PASSWORD,
    v: 1,
    format: "json",
  });

  return response?.status === "VALID" || response?.status === "VALIDATED";
}
