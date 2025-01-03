const customerModel=require('../models/CustomerModel');

// Create and Save a new Customer
const createCustomer=async (req,res)=>{
    

    try{
        const{ name,email,phone}=req.body;
        const Customer=new customerModel({name,email,phone});
        await Customer.save();

        res.status(201).json({message:"Customer created successfully",data:Customer});
    }catch(error){
        console.log(error);
        res.status(500).json({message:"something went wrong",error});
    }
};

//find all customers
const findAllCustomers=async (req,res)=>{
    try{
        const customers=await customerModel.find();
        res.status(200).json({data:customers});
    }catch(error){
        res.status(500).json({message:"something went wrong",error});
    }
};

//find customer by id
const findCustomerById=async (req,res)=>{
    try{
        const {id}=req.params;
        const customer=await customerModel.findById(id);

        if(!customer){
            return res.status(404).json({message:"Customer not found"});
        }
        res.status(200).json({message:"Customer found",data:customer});
    }catch(error){
        res.status(500).json({message:"something went wrong",error});
    }
};
//update customer
const updateCustomer=async (req,res)=>{

    try {
        const {id}=req.params;
        const {name,email,phone}=req.body;

        const UpdatedCustomer= await customerModel.findByIdAndUpdate(id,{name,email,phone},{new:true});

        if(!UpdatedCustomer){
            return res.status(404).json({message:"Customer not found"});
        }
        res.status(200).json({message:"Customer updated",data:UpdatedCustomer});
    } catch (error) {
        res.status(500).json({message:"something went wrong",error});
    }
}

//delte customer

const deleteCustomer=async (req,res)=>{
    try {
        const {id}=req.params;
        const customer=await customerModel.findByIdAndDelete(id);

        if(!customer){
            return res.status(404).json({message:"Customer not found"});
        }
        res.status(200).json({message:"Customer deleted"});
    } catch (error) {
        res.status(500).json({message:"something went wrong",error});
    }
}

module.exports={createCustomer,findAllCustomers,findCustomerById,updateCustomer,deleteCustomer};

