export const getStoredStaffId = () => {
  const storedId = localStorage.getItem("id");

  if (storedId) {
    return storedId;
  }

  // Backwards compatibility with legacy keys
  return localStorage.getItem("staffId") || localStorage.getItem("userId") || null;
};

