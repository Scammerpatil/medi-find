"use client";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CartItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  prescriptionRequired: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (medicine: {
    _id: string;
    name: string;
    price: number;
    prescriptionRequired: boolean;
  }) => void;
  updateQuantity: (medicineId: string, newQuantity: number) => void;
  removeFromCart: (medicineId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      setCart(JSON.parse(cartData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (medicine: {
    _id: string;
    name: string;
    price: number;
    prescriptionRequired: boolean;
  }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.medicineId === medicine._id
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.medicineId === medicine._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.price,
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            medicineId: medicine._id,
            name: medicine.name,
            price: medicine.price,
            quantity: 1,
            totalPrice: medicine.price,
            prescriptionRequired: medicine.prescriptionRequired,
          },
        ];
      }
    });
    toast.success(`${medicine.name} added to cart`);
  };

  const updateQuantity = (medicineId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.medicineId === medicineId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.price,
            }
          : item
      )
    );
  };

  const removeFromCart = (medicineId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.medicineId !== medicineId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
