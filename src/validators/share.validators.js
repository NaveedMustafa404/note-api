export const validateShare = ({ email, permission }) => {
    if (!email || !permission) return "email and permission are required";
    if (!["read", "edit"].includes(permission))
        return "permission must be read or edit";
    return null;
};
