import { dashboardService } from '../services/index.js';


export const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats(req.user._id, req.user.role);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};
