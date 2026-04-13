import { userService } from '../services/index.js';
import { verifyMongoId } from '../utils/index.js';


export const getAll = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, role, department, search } = req.query;

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const query = {
      isActive: true
    };

    if (role) query.role = role;
    if (department) query.department = department;

    if (search && search.trim()) {
      const safeSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    const result = await userService.getAllUsers(query, {
      page: pageNum,
      limit: limitNum
    });

    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });

  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await userService.getUserById(id);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    verifyMongoId(id);

    const user = await userService.updateUser(id, req.body);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    verifyMongoId(id);

    await userService.deleteUser(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}


export const getTeamMembers = async (req, res, next) => {
  try {
    const id = req.user._id;
    // verify mongodb id
    verifyMongoId(id);
    const teamMembers = await userService.getTeamMembers(req.user._id);

    res.json({
      success: true,
      data: { teamMembers }
    });
  } catch (error) {
    next(error);
  }
}

export const getStats = async (req, res, next) => {
  try {
    const stats = await userService.getStats();

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
}

