import Customer from "../model/customer.schema.js";

export const searchCustomerController = async (req, res) => {
    const searchTerm = req.query.name || "";
    try {
        const customers = await Customer.find({
            name:{$regex: searchTerm, $options: "i"} // for case insensitveness
        });
        res.status(200).json(customers);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({message: "Server error while searching"});
    }
}