"use client";

import React, { useState } from "react";
import AlertDialogDrawer, { AlertType } from "./AlertDialogDrawer";
import Button from "@/components/ui/button/Button";

/**
 * Example usage of AlertDialogDrawer component
 * This demonstrates how to use the dynamic dialog/drawer for different alert types
 */
const AlertDialogDrawerExample: React.FC = () => {
    const [openAlert, setOpenAlert] = useState(false);
    const [alertType, setAlertType] = useState<AlertType>("error");

    const showAlert = (type: AlertType) => {
        setAlertType(type);
        setOpenAlert(true);
    };

    const handleConfirm = () => {
        console.log(`${alertType} alert confirmed`);
    };

    const getAlertContent = () => {
        switch (alertType) {
            case "error":
                return {
                    title: "Danger Alert!",
                    description:
                        "Lorem ipsum dolor sit amet consectetur. Feugiat ipsum libero tempor felis risus nisi non. Quisque eu ut tempor curabitur.",
                };
            case "success":
                return {
                    title: "Success!",
                    description:
                        "Your action has been completed successfully. All changes have been saved.",
                };
            case "warning":
                return {
                    title: "Warning!",
                    description:
                        "Please review your changes carefully before proceeding. This action may have important consequences.",
                };
            case "info":
                return {
                    title: "Information",
                    description:
                        "Here's some important information you should know about this feature.",
                };
        }
    };

    const content = getAlertContent();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Alert Dialog/Drawer Examples</h2>

            <div className="flex flex-wrap gap-3">
                <Button onClick={() => showAlert("error")} variant="outline">
                    Show Error Alert
                </Button>
                <Button onClick={() => showAlert("success")} variant="outline">
                    Show Success Alert
                </Button>
                <Button onClick={() => showAlert("warning")} variant="outline">
                    Show Warning Alert
                </Button>
                <Button onClick={() => showAlert("info")} variant="outline">
                    Show Info Alert
                </Button>
            </div>

            <AlertDialogDrawer
                open={openAlert}
                setOpen={setOpenAlert}
                type={alertType}
                title={content.title}
                description={content.description}
                buttonText="Okay, Got It"
                onConfirm={handleConfirm}
            />
        </div>
    );
};

export default AlertDialogDrawerExample;
