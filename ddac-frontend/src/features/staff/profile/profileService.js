let profileDB = {
  id: 1,
  fullName: "John Doe",
  email: "johndoe@example.com",
  phone: "012-3456789",
  address: "123 Jalan ABC, Kuala Lumpur",
  profilePicture: null, // connect to S3 later
};

export const getProfile = async () => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(profileDB), 200)
  );
};

export const updateProfile = async (updated) => {
  profileDB = { ...profileDB, ...updated };
  return new Promise((resolve) =>
    setTimeout(() => resolve(profileDB), 200)
  );
};
