//src/pages/ItemPage.jsx

import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export default function ItemPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add item form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/item`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.log("==>fetchItems error: ", error);
    }
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await fetch(`${API_URL}/api/item`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      setName("");
      setDescription("");
      fetchItems();
    } catch (error) {
      console.log("==>addItem error: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/item?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchItems();
    } catch (error) {
      console.log("==>deleteItem error: ", error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditName(item.name);
    setEditDescription(item.description || "");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/item`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name: editName,
          description: editDescription,
        }),
      });
      setEditingId(null);
      fetchItems();
    } catch (error) {
      console.log("==>updateItem error: ", error);
    }
  };

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Items
      </Typography>

      {/* Add Item Form */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <TextField
            label="Name"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Description"
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Add
          </Button>
        </form>
      </Paper>

      {/* Items Table */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell align="center" sx={{ width: 200 }}>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item._id}>
                    {editingId === item._id ? (
                      <>
                        <TableCell>
                          <TextField
                            size="small"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={editDescription}
                            onChange={(e) =>
                              setEditDescription(e.target.value)
                            }
                            fullWidth
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={handleUpdate}
                            sx={{ mr: 1 }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            onClick={() => handleEdit(item)}
                            sx={{ mr: 1 }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
