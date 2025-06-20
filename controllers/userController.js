// backend/controllers/userController.js
export const updateProfile = async (req, res) => {
  const { name, phone, address, profilePic, coverPic } = req.body;
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { name, phone, address, profilePic, coverPic },
    { new: true }
  );
  res.json(user);
};

// controllers/userController.js
export const getProfile = async (req, res) => {
  const user = await userModel.findById(req.user._id);
  res.json(user);
};
