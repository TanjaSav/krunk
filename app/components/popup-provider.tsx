"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type ShowPopup = (message: string) => void;

const PopupContext = createContext<ShowPopup | null>(null);

export function usePopup(): ShowPopup {
  const showPopup = useContext(PopupContext);
  if (!showPopup) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return showPopup;
}

interface PopupProviderProps {
  children: ReactNode;
}

export function PopupProvider({ children }: PopupProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showPopup = useCallback((msg: string) => {
    setMessage(msg);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <PopupContext.Provider value={showPopup}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-message"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-gray-700 bg-[#16181c] p-6 shadow-xl">
            <p id="popup-message" className="mb-6 text-center text-[15px] text-gray-100">
              {message}
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleClose}
                className="h-[46px] min-w-[120px] rounded-[24px] px-6 font-medium transition-opacity hover:opacity-90 active:opacity-80"
                style={{
                  backgroundColor: "#1d9bf0",
                  color: "#E0E0E0",
                  fontFamily: "var(--font-poppins), Poppins, sans-serif",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
}
