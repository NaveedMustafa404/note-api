import authService from "../services/auth.service.js";
import { validateLoginData, validateRegisterData } from "../validators/auth.validators.js";

export const register = async (req, res, next) => {
    try {
        const errorMsg = validateRegisterData(req.body);
        if (errorMsg) {
            return res.status(400).json({ success: false, message: errorMsg });
        }

        const user = await authService.register(req.body);
        return res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const errorMsg = validateLoginData(req.body);
        if (errorMsg) {
            return res.status(400).json({ success: false, message: errorMsg });
        }
        const token = await authService.login(req.body);
        return res.status(200).json({ success: true, data: token });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    try {
        const data = await authService.refresh(req.body.refreshToken);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.logout(req.body.refreshToken);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
};
