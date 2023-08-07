import categoryModel from "../models/categoryModel.js"
import slugify from "slugify"

// create category
export const createCategoryController = async (req, res) =>{
    try{
        const {name} = req.body
        if (!name){
            return res.status(401).send({message: "Tên loại hàng bắt buộc phải nhập"})
        }
        const existingCategory = await categoryModel.findOne({name})
        if (existingCategory){
            return res.status(200).send({
                success: false,
                message: "Loại hàng tồn tại"
            })
        }
        const category = await new categoryModel({name, slug:slugify(name)}).save()
        res.status(201).send({
            success: true,
            message: "Tạo loại hàng mới thành công",
            category
        })

    }catch (error){
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Lỗi loại hàng",
            error
        })
    }
}
//update category
export const updateCategoryController = async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const category = await categoryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true }
      );
      res.status(200).send({
        success: true,
        messsage: "Cập nhật loại hàng thành công",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Lỗi trong khi cập nhật loại hàng",
      });
    }
};
  
// get all cat
export const categoryControlller = async (req, res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "Danh sách tất cả các loại hàng",
        category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Lỗi trong khi lấy tất cả loại hàng",
        });
    }
};

// single category
export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        res.status(200).send({
            success: true,
            message: "Loại hàng này tồn tại",
            category,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Không tìm thấy loại hàng này",
        });
    }
};

//delete category
export const deleteCategoryCOntroller = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Xóa loại hàng thành công",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Lỗi khi xóa loại hàng này",
            error,
        });
    }
};