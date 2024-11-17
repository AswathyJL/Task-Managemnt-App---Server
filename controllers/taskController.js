
const tasks = require('../models/taskModel')
const mongoose = require("mongoose");

// to add task - need authorisation
exports.addTaskController = async(req,res)=>{
    console.log(`Inside addTaskController`);
    const userId = req.userId
    // console.log(userId);

    const {title,startDate,endDate,description,progress} = req.body
    // console.log(title,startDate,endDate,description,status,progress);
    try {

        // Validate endDate >= startDate
        if (endDate < startDate) {
            return res
            .status(400)
            .json({ message: "endDate must be after or on startDate." });
        }

        // Automatically determine the status based on progress and endDate
        let status;
        const currentDate = new Date();
        if (progress === 0) {
            status = "Not Yet Started";
        } else if (progress > 0 && progress < 100) {
            status = "Ongoing";
        } else if (progress === 100) {
            status = "Completed";
        }
        if (new Date(endDate) < currentDate && progress < 100) {
            status = "Pending"; // Overrides if end date has passed and progress is incomplete
        }

        // Create the task
        const newTask = new tasks({
            title,
            startDate,
            endDate,
            description,
            status,
            userId,
            progress,
        });
        await newTask.save()
        console.log("Task saved successfully:", newTask);
        res.status(200).json(newTask)
    } catch (err) {
        console.error("Error creating task:", err.message);
        res.status(401).json(err)
    }
    
}

// to edittask - need authorisation
exports.editTaskController = async (req, res) => {
    console.log(`Inside editTaskController`);
    const { userId } = req;  // userId from the authenticated user
    const { id } = req.params;
    const { title, startDate, endDate, description, progress } = req.body;

    console.log("Task ID:", id);
    console.log("User ID:", userId);
    // Check if progress is within valid range
    if (progress < 0 || progress > 100) {
        return res.status(400).json({ message: "Progress must be between 0 and 100" });
    }

    try {
        console.log(`Request Body:`, req.body);

        // Validate id format - ensure it's a valid ObjectId string
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        let status;
        let updatedProgress = parseInt(progress); // Ensure progress is a number
        const currentDate = new Date();

        if (updatedProgress === 0) {
            status = "Not Yet Started";
        } else if (updatedProgress > 0 && updatedProgress < 100) {
            status = "Ongoing";
        } else if (updatedProgress === 100) {
            status = "Completed";
        }

        // Check if the end date has passed
        if (new Date(endDate) < currentDate) {
            if (updatedProgress < 100) {
                status = "Pending"; // Incomplete after due date
            } else if (updatedProgress === 100) {
                status = "Completed"; // Overrides "Pending" if task is now complete
            }
        } else if (updatedProgress === 100) {
            // If end date hasn't passed but progress is 100
            status = "Completed";
        }

        // Ensure progress is 100 if status is "Completed"
        if (status === "Completed") {
            updatedProgress = 100;
        }

        // Find the task and ensure it's associated with the correct userId
        const updateTask = await tasks.findOneAndUpdate(
            { _id: id, userId },  // Check both task ID and userId
            {
                title,
                startDate,
                endDate,
                description,
                status,
                progress:updatedProgress
            },
            { new: true }  // Return updated task
        );

        if (!updateTask) {
            return res.status(404).json({ message: "Task not found or unauthorized access" });
        }

        console.log("Task updated successfully:", updateTask);
        res.status(200).json(updateTask);
    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

// to get all task - need authorisation
exports.allTaskController = async(req,res)=>{
    console.log(`Inside allTaskController`);
    const searchKey = req.query.search
    console.log(searchKey);
    const query = {
        title:{
            $regex:searchKey,
            $options:'i'
        }
    }
    
    try
    {
        const allTasks = await tasks.find(query)
        res.status(200).json(allTasks)
    }
    catch(err)
    {
        res.status(401).json(err)
    }
}

// to remove task - need authorisation
exports.removeTaskController = async(req,res)=>{
    console.log(`Inside allTaskController`);
    const {id} = req.params
    try{
        const deleteTasks = await tasks.findByIdAndDelete({_id:id})
        res.status(200).json(deleteTasks)
    }catch(err){
        res.status(401).json(err)
    }
}