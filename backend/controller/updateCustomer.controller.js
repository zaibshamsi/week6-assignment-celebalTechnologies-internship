import Customer from "../model/customer.schema.js";

export const updateCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, credit: amount },
      { new: true } // returns the updated document this was the bug so i commented it
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 