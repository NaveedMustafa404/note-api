
export const validateRegisterData = (userData) => {
    const { email, password } = userData;
    
    if (!email || !password)
        return "email and password are required";

    if (typeof email !== "string" || typeof password !== "string") 
        return "email and password must be strings";
    
    if (!email.includes("@")) 
        return "invalid email format";
    
    if (password.length < 6) 
        return "password must be at least 6 characters";

    return null;
};

export const validateLoginData = (userData) => {
    const { email, password } = userData;

    if (!email || !password) 
        return "email and password are required";
    return null;
};
