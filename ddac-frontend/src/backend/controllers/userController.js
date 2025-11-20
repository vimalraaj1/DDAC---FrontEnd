import fs from "fs";
import path from "path";

const filePath = path.resolve("data/users.json");

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf8") || "[]");
const writeData = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");


export const createUser = (req, res) => {
  const users = readData();
  const newUser = { id: users.length ? users[users.length - 1].id + 1 : 1, ...req.body };
  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
};


export const getUsers = (req, res) => {
  res.json(readData());
};


export const getUsersByRole = (req, res) => { 
    try {
      const role = req.params.role || req.query.role;
  
      if (!role) {
        return res.status(400).json({ error: "Role is required" });
      }
  
      const users = readData();
      const filtered = users.filter(user => user.role === role);
  
      if (filtered.length === 0) {
        return res.status(404).json({ message: `No users found with role: '${role}'` });
      }
  
      res.json(filtered);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to read users" });
    }
  };
  
