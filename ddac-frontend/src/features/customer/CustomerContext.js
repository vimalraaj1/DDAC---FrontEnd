import { createContext, useContext } from "react";

export const CustomerContext = createContext();

export function useCustomer() {
  return useContext(CustomerContext);
}
