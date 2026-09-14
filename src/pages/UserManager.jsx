//src/pages/UserManager.jsx

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export default function UserManager() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Change password dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [saving, setSaving] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.log("==>fetchUsers error: ", error);
    }
    setLoading(false);
  };

  const handleOpenDialog = (u) => {
    setSelectedUser(u);
    setNewPassword("");
    setConfirmPassword("");
    setDialogError("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setDialogError("");
  };

  const handleChangePassword = async () => {
    // Validation
    if (!newPassword) {
      setDialogError("New password is required");
      return;
    }
    if (newPassword.length < 4) {
      setDialogError("Password must be at least 4 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setDialogError("Passwords do not match");
      return;
    }

    setSaving(true);
    setDialogError("");

    try {
      const res = await fetch(`${API_URL}/api/user/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: selectedUser.email,
          newPassword: newPassword,
        }),
      });

      if (res.ok) {
        setSnackbar({
          open: true,
          message: `Password changed successfully for ${selectedUser.email}`,
          severity: "success",
        });
        handleCloseDialog();
      } else {
        const errData = await res.json();
        setDialogError(errData.error || "Failed to change password");
      }
    } catch (error) {
      console.log("==>changePassword error: ", error);
      setDialogError("Network error");
    }

    setSaving(false);
  };

  // Only admin (user._id == "-1") can access this page
  if (!user || user._id != "-1") {
    return (
      <div className="p-4">
        <Typography variant="h6" color="error">
          Access Denied. Admin only.
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        User Management
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Username</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.username || "-"}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        size="small"
                        color="warning"
                        onClick={() => handleOpenDialog(u)}
                      >
                        Change Password
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Change Password Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Change Password for {selectedUser?.email}
        </DialogTitle>
        <DialogContent>
          {dialogError && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {dialogError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={saving}
          >
            {saving ? "Saving..." : "Change Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
