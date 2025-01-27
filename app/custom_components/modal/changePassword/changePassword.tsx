import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookie from "js-cookie";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from "@material-tailwind/react";

interface ModalChangePassword {
    isOpen : boolean,
    onClose : () => void;
}
 
export default function DialogDefault({isOpen, onClose}:ModalChangePassword) {
    const [oldPassword, setoldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () =>{
        setErrorMessage('');

        if (newPassword !== confirmPassword) {
            setErrorMessage("Password tidak sama!.");
            return;
        }

        try {
            const access_token = Cookie.get("access_token"); // Get access token from cookies
      
            const response = await fetch('/api/auth/change-password', {
              method: 'PATCH',  // Use PATCH here
              headers: {
                'Content-Type': 'application/json',
                'AccessToken': `${access_token}`,  // Attach token for authentication
              },
              body: JSON.stringify({
                oldPassword,
                newPassword,
              }),
            });
      
            const result = await response.json();
      
            if (response.ok) {
              toast.success('Password changed successfully!', {
                position: "top-right",
                autoClose: 3000,
              });
              setTimeout(onClose, 3000); // Close modal after success
            } else {
              setErrorMessage(result.message || 'Failed to change password.');
              toast.error(result.message || 'Failed to change password.', {
                position: "top-right",
                autoClose: 3000,
              });
            }
          } catch (error) {
            console.error('Error during password change:', error);
            setErrorMessage('An error occurred. Please try again.');
            toast.error('An error occurred. Please try again.', {
              position: "top-right",
              autoClose: 3000,
            });
          }
    }

  return (
    <>
      <Dialog open={isOpen} handler={onClose} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <DialogHeader placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} className="text-center font-Kumbh">Change Password</DialogHeader>
        <DialogBody placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <div>
                <Typography
                          variant="small"
                          color="blue-gray"
                          className="mb-1 font-medium" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                    Old Password
                </Typography>
                <Input type="password" onChange={(e) => setoldPassword(e.target.value)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}/>
            </div>
            <div>
                <Typography
                          variant="small"
                          color="blue-gray"
                          className="mb-1 font-medium" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                    New Password
                </Typography>
                <Input type="password" onChange={(e) => setNewPassword(e.target.value)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}/>
            </div>
            <div>
                <Typography
                          variant="small"
                          color="blue-gray"
                          className="mb-1 font-medium" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                >
                    Confirm New Password
                </Typography>
                <Input type="password" onChange={(e) => setConfirmPassword(e.target.value)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}/>
            </div>
        </DialogBody>
        <DialogFooter placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <Button
                      variant="text"
                      color="red"
                      onClick={onClose}
                      className="mr-1" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={() => {
            handleSubmit();
            onClose();
          }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}