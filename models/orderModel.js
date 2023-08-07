import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Nhận đơn hàng",
      enum: ["Nhận đơn hàng", "Đang xử lý", "Đang giao", "Giao thành công", "Hủy"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("order", orderSchema);