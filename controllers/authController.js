import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

export const registerController = async(req, res) =>{
    try{
        const {name, email, password, phone, address, answer} = req.body
        // validation
        if(!name){
            return res.send({message: 'Tên bắt buộc phải nhập'})
        }
        if(!email){
            return res.send({message: 'Email bắt buộc phải nhập'})
        }
        if(!password){
            return res.send({message: 'Mật khẩu bắt buộc phải nhập'})
        }
        if(!phone){
            return res.send({message: 'Số điện thoại bắt buộc phải nhập'})
        }
        if(!address){
            return res.send({message: 'Địa chỉ bắt buộc phải nhập'})
        }
        if(!answer){
          return res.send({message: 'Câu trả lời bắt buộc phải nhập'})
      }

       //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Email đã tồn tại",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "Đăng ký thành công",
      user,
    });
    } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi đăng ký",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Sai email hoặc mật khẩu",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email chưa được đăng ký",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Sai mật khẩu",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role, 
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Đăng nhập thất bại",
      error,
    });
  }
};

// forgot controller
export const forgotPasswordController = async (req, res) =>{
  try{
    const {email, answer, newPassword} = req.body
    if(!email){
      res.status(400).send({message: 'Email bắt buộc phải nhập'})
    }
    if(!answer){
      res.status(400).send({message: 'Câu trả lời bắt buộc phải nhập'})
    }
    if(!newPassword){
      res.status(400).send({message: 'Mật khẩu mới bắt buộc phải nhập'})
    }

    // check 
    const user = await userModel.findOne({email, answer})
    // validation
    if (!user){
      return res.status(404).send({
        success: false,
        message: "Email hoặc câu trả lời không chính xác"
      })
    };
    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user.id, {password: hashed});
    res.status(200).send({
      success: true,
      message: "Đổi mật khẩu thành công"
    })
  } catch(error){
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Xảy ra lỗi!",
      error
    })
  }
};

// test controller
export const testController = (req, res) => {
  try {
    res.send("Được phép truy cập");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Mật khẩu phải dài hơn 6 ký tự" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Cập nhật thông tin thành công",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Lỗi khi cập nhật thông tin",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi lấy đơn hàng",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi lấy tất cả đơn hàng",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Lỗi khi cập nhật đơn hàng",
      error,
    });
  }
};
