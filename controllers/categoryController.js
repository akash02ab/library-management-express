const CategoryModel = require("../models/category");

async function showAllCategory() {
    try {
        let categories = await CategoryModel.find();
        return categories.map((category) => category.name);
    } catch (err) {
        return err;
    }
}

async function addNewCategory(response) {
    try {
        const category = new CategoryModel({ name: response });
        await category.save();
        return "Category added successfully";
    } catch (err) {
        return err;
    }
}

async function deleteCategory(response) {
    try{
        let res = await CategoryModel.deleteOne({name: response});
        if(res.deletedCount) {
            return 'Deletion Successful';
        }
        else {
            return 'No record found named ' + response;
        }
    }catch(err) {
        return err; 
    }
}

const CategoryController = {
    showAllCategory,
    addNewCategory,
    deleteCategory,
};

module.exports = CategoryController;
