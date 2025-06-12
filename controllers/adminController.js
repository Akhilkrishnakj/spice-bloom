// controllers/adminController.js

export const getAdminDashboardData = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "Admin dashboard data",
      data: {
        users: 10,
        products: 25,
        orders: 12,
      }
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};
