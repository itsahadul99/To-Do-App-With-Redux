import { confirmAlert } from "react-confirm-alert"; // Import react-confirm-alert
import { register } from "register-service-worker";
import toast from "react-hot-toast";

// Confirmation Modal Component
const IConfirmModal = (props: {
  title: string;
  message: string;
  yesAlertFunc: () => void;
  noAlertFunc: () => void;
  closeOnClickOutside?: boolean;
}) => {
  const { title, message, yesAlertFunc, noAlertFunc, ...rest } = props;

  return confirmAlert({
    title,
    message,
    buttons: [
      {
        label: "Update",
        onClick: yesAlertFunc,
      },
      {
        label: "No",
        onClick: noAlertFunc,
      },
    ],
    ...rest,
  });
};

// Update Popup Function
const updatePopUp = () => {
  const confirmObject = {
    title: "Update Action",
    closeOnClickOutside: false,
    message:
      'If you press "Yes", you will get the latest changes. Otherwise, you can refresh the page manually to get the latest changes.',
    yesAlertFunc: () => {
      window.location.reload();
    },
    noAlertFunc: () => {
      // No action required
    },
  };

  IConfirmModal(confirmObject);
};

// Service Worker Popup Function
export const serviceWorkerPopUp = () => {
  const swUrl = '../service-worker.js';
  register(swUrl, {
    updated(registration) {
      console.log("New content is available; please refresh.");
      if (registration && registration.waiting) {
        // Send a message to the waiting service worker to skip waiting
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      // Show the update popup
      updatePopUp();
    },
    offline() {
      console.log("No internet connection found. App is running in offline mode.");
      toast.error("No internet connection found. App is running in offline mode.");
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
};
