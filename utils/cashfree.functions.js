const CashFree = require("cashfree-pg-sdk-nodejs");
const CFConfig = CashFree.CFConfig;
const CFPaymentGateway = CashFree.CFPaymentGateway;
const CFEnvironment = CashFree.CFEnvironment;
const CFCustomerDetails = CashFree.CFCustomerDetails;
const CFOrderRequest = CashFree.CFOrderRequest;

const cfConfig = new CFConfig(CFEnvironment.SANDBOX, "2022-01-01", process.env.CASHFREE_APPID, process.env.CASHFREE_SECRET_KEY);

const createOrder = async ({name, customerId, phone, email}, {orderId, orderAmount}) => {
    try {
        const apiInstance = new CFPaymentGateway();

        const customerDetails = new CFCustomerDetails();
        customerDetails.customerId = customerId;
        customerDetails.customerName = name;
        customerDetails.customerPhone = phone;
        customerDetails.customerEmail = email;

        const cFOrderRequest = new CFOrderRequest();
        cFOrderRequest.orderId = orderId;
        cFOrderRequest.orderAmount = orderAmount;
        cFOrderRequest.orderCurrency = "INR";
        cFOrderRequest.customerDetails = customerDetails;

        const result = await apiInstance.orderCreate(
            cfConfig,
            cFOrderRequest
        );
        if (result != null) {
            return result
        } else {
            throw Error('Order is not created')
        }
    } catch (e) {
        throw e;
    }
}

module.exports = {createOrder};
