import Customer from "../model/customer.schema.js";

export const getAllCustomerController = async (req, res) => {
    try {
        const customers = await Customer.find({});
         res.status(200).json(customers)
    } catch (error) {
        console.error("failed to fetch error", error)
        res.status(500).json({message:"server error"})
    }
}