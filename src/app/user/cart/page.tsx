"use client";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartContext";
import { Order } from "@/types/Order";
import { IconTrash, IconPlus, IconMinus } from "@tabler/icons-react";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const CartPage = () => {
  const { user } = useAuth();
  const [order, setOrder] = useState<Order>({
    user: null,
    store: null,
    deliveryBoy: null,
    medicines: [
      {
        medicineId: "",
        name: "",
        price: 0,
        quantity: 0,
      },
    ],
    prescriptionId: "",
    totalAmount: 0,
    paymentMethod: "COD",
    status: "Pending",
    paymentStatus: "Pending",
    pickupLocation: {
      type: "Point",
      coordinates: [0, 0],
    },
    dropLocation: {
      type: "Point",
      coordinates: [0, 0],
    },
  });
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);

  const requiresPrescription = cart.some((item) => item.prescriptionRequired);
  const isCheckoutDisabled = requiresPrescription && !prescriptionImage;

  const handlePrescriptionUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    folderName: string,
    imageName: string,
    path: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionImage(e.target.files[0]);
      if (prescriptionImage?.size! > 5 * 1024 * 1024) {
        toast.error("File size is more than 5MB");
        return;
      }
      const imageResponse = axios.postForm("/api/helper/upload-img", {
        file: e.target.files[0],
        name: imageName,
        folderName: folderName,
      });
      console.log(imageResponse);
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setOrder({
            ...order,
            [path]: data.data.path,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };

  const increment = (itemId: string) => {
    addToCartById(itemId);
  };

  const decrement = (itemId: string) => {
    const item = cart.find((i) => i.medicineId === itemId);
    if (item) {
      if (item.quantity > 1) {
        updateQuantity(itemId, item.quantity - 1);
      } else {
        removeFromCart(itemId);
      }
    }
  };

  const addToCartById = (itemId: string) => {
    const item = cart.find((i) => i.medicineId === itemId);
    if (item) {
      updateQuantity(itemId, item.quantity + 1);
    }
  };

  const finalTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  if (cart.length === 0) {
    return (
      <>
        <img
          src="/empty.png"
          alt="Empty Cart"
          className="w-80 mb-4 mx-auto items-center"
        />
        <h2 className="text-2xl font-semibold text-center">
          Your cart is empty.
        </h2>
      </>
    );
  }

  const handlePlaceOrder = (payment: "COD" | "ONLINE") => {
    const medicines = cart.map((item) => ({
      medicineId: item.medicineId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));
    const prescriptionId = requiresPrescription ? order.prescriptionId : null;
    const paymentMethod = payment;

    const res = axios.post("/api/order/place-order", {
      medicines,
      prescriptionId,
      paymentMethod,
      totalAmount: finalTotal,
    });
    toast.promise(res, {
      loading: "Wait a minute placing your order!!!",
      success: (res: AxiosResponse) => {
        clearCart();
        if (payment === "ONLINE") {
          const options = {
            key: "rzp_test_cXJvckaWoN0JQx",
            amount: finalTotal * 100,
            currency: "INR",
            name: "MediFind",
            description: "Medicine Order Payment",
            order_id: res.data.orderId,
            handler: () => {
              toast.success("Payment Successful!");
            },
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.contact,
            },
          };
          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function (response: any) {
            toast.error(response.error.description);
          });
          rzp.open();
        }
        return "Order placed successfully";
      },
      error: "Oops!!! Something went wrong!!!",
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center uppercase">
        Your Cart
      </h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-base-300">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Prescription Required</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.medicineId}>
                <td>{item.name}</td>
                <td>{item.prescriptionRequired ? "Yes" : "No"}</td>
                <td>₹{item.price}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-xs btn-outline btn-primary"
                      onClick={() => decrement(item.medicineId)}
                    >
                      <IconMinus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => increment(item.medicineId)}
                    >
                      <IconPlus size={14} />
                    </button>
                  </div>
                </td>
                <td>₹{item.totalPrice}</td>
                <td>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => removeFromCart(item.medicineId)}
                  >
                    <IconTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requiresPrescription && (
        <div className="mt-6 flex flex-col gap-2 items-start">
          <label className="font-semibold">
            Prescription Required. Please upload image:
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-primary file-input-bordered w-full max-w-xs"
            onChange={(e) => {
              handlePrescriptionUpload(
                e,
                "prescriptions",
                `${user?.name}_prescription`,
                "prescriptionId"
              );
            }}
          />
          {prescriptionImage && (
            <p className="text-sm text-success">
              Image uploaded: {prescriptionImage.name}
            </p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
        <button className="btn btn-error" onClick={clearCart}>
          Clear Cart
        </button>
        <div className="text-lg font-semibold">
          <span>Total Amount: </span>
          <span className="text-accent">₹{finalTotal}</span>
        </div>
      </div>

      {!isCheckoutDisabled && (
        <div className="mt-6 flex gap-4 items-center justify-center">
          <button
            className="btn btn-accent"
            onClick={() => {
              handlePlaceOrder("COD");
            }}
          >
            Cash on Delivery
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              handlePlaceOrder("ONLINE");
            }}
          >
            Pay Online
          </button>
        </div>
      )}
    </>
  );
};

export default CartPage;
