export const login = async (email, password) => {
    await new Promise(res => setTimeout(res, 800));

    // Mock login data with different roles
    const mockUsers = {
        "customer@gmail.com": {
            email: "customer@gmail.com",
            name: "Customer User",
            role: "customer",
            password: "123456"
        },
        "staff@gmail.com": {
            email: "staff@gmail.com", 
            name: "Staff User",
            role: "staff",
            password: "123456"
        },
        "doctor@gmail.com": {
            email: "doctor@gmail.com",
            name: "Doctor User", 
            role: "doctor",
            password: "123456"
        }
    };

    const user = mockUsers[email];
    if (user && user.password === password) {
        return {
            success: true,
            token: `mock-token-${user.role}-${Date.now()}`,
            user: {
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    }

    return { success: false, message: "Invalid email or password" };
};

export const register = async (data) => {
    await new Promise(res => setTimeout(res, 800));

    console.log("Mock Register: ", data);

    return {
        success: true,
        message: "Registered Successfully!"
    };
};