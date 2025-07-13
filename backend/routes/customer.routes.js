import { Router } from "express"
import { createCustomerController } from "../controller/createCustomer.controller.js";
import { getAllCustomerController } from "../controller/getAllCustomer.controller.js";
import { deleteCustomerController } from "../controller/deleteCustomer.controller.js";
import { updateCustomerController } from "../controller/updateCustomer.controller.js";
import { searchCustomerController } from "../controller/search.controller.js";

export const CustomerRoutes = Router();

CustomerRoutes.post("/create", createCustomerController);
CustomerRoutes.get("/all", getAllCustomerController)
CustomerRoutes.get("/search", searchCustomerController);
CustomerRoutes.delete("/delete/:id", deleteCustomerController);
CustomerRoutes.put("/update/:id", updateCustomerController)