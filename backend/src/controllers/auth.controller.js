import { authService } from '../services/index.js';
import { attachTokenToResponse, clearTokenFromResponse } from '../utils/jwt.js';


// Contorller function for registering a new user
export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);

    attachTokenToResponse(res, token);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

// for logging in a user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await authService.login(email, password);

    attachTokenToResponse(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};

// for getting the profile of the logged in user
export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// for updating the profile of the logged in user
export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// logging out the user by clearing the token from the response
export const logout = async (req, res, next) => {
  try {
    clearTokenFromResponse(res);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Change password for the logged in user
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};
