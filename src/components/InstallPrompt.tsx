import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install button
      setModalVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Call the prompt() method
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setModalVisible(false);
      });
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <div>
      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Install To Do Keeper App
            </h2>
            <p className="text-gray-600 mb-6">
              Do you want to install this app on your device for a better experience?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstallPrompt;
