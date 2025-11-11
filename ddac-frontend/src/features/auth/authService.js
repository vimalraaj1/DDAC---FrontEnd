export const login = async (email, password) => {
    await new Promise(res => setTimeout(res, 800));

    // mock login data 
    if (email === "test@gmail.com" && password === "123456") {
        return {
            success: true,
            token: "mock-token-123",
            user: {email, name: "Test User"}
        };
    }

    return {success: false};
};

export const register = async (data) => {
    await new Promise(res => setTimeout(res, 800));

    console.log("Mock Register: ", data);

    return {
        success: true,
        message: "Registered Successfully!"
    };
};