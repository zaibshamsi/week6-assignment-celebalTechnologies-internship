import Customer from "../model/customer.schema.js";

export const deleteCustomerController = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Customer.findByIdAndDelete(id);

        if(!deleted) {
            return res.status(404).json({message:"customer can not be deleted"})
        }
        res.status(200).json({message:"customer deleted successfully"});
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}