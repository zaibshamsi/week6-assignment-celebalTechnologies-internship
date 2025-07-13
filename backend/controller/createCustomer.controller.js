import Customer from "../model/customer.schema.js"

export const createCustomerController = async (req, res) => {
    try {
        const customer = new Customer(req.body);

        const { name, amount } = req.body;
        const existingCustomer = await Customer.findOne({
            name,
            amount
        })
        if (existingCustomer) {
            return res.status(409).json({ message: "customer already exist" })
        }

        await customer.save()
        return res.status(200).json({ message: "Talent saved", customer });
    } catch (error) {
        console.error("Backend error:", error);

        return res.status(500).json({
            message: "Server error occurred",
            error: error.message
        });
    }
}