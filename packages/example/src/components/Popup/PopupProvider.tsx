// Copyright 2022 Fewcha. All rights reserved.

import React, {
  useContext,
  createContext,
  useState,
  PropsWithChildren,
  useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";

type PopupType = (props: {
  Component: React.FC<{}>;
  callback?: (key: string) => void;
}) => string;

export const PopupContext = createContext<{
  addPopup: PopupType;
  removePopup: (key: string) => void;
}>({
  addPopup: () => "",
  removePopup: () => {},
});

export const usePopups = () => {
  const { addPopup, removePopup } = useContext(PopupContext);
  return { addPopup, removePopup };
};

const { Provider } = PopupContext;

const PopupProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [popups, changePopups] = useState<
    { key: string; Component: React.FC }[]
  >([]);
  const popupBackgroundService = useRef<HTMLDivElement | null>(null);

  const addPopup: PopupType = ({ Component, callback }): string => {
    const key = uuidv4();
    changePopups([...popups, { key, Component }]);
    if (callback) callback(key);
    return key;
  };

  const removePopup = (key: string) => {
    changePopups(popups.filter((popup) => popup.key !== key));
  };

  const Component =
    popups.length > 0 ? popups[popups.length - 1].Component : () => <></>;

  return (
    <Provider value={{ addPopup, removePopup }}>
      {children}
      {popups.length > 0 && (
        <div
          className="fixed z-40 inset-0 overflow-y-auto"
          onClick={(e) => {
            if (e.target !== popupBackgroundService.current) {
              return;
            }
            removePopup(popups[popups.length - 1].key);
          }}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              {/* background */}
              <div
                ref={popupBackgroundService}
                className="absolute inset-0 popup-background"
              ></div>
            </div>
            <span
              className="sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Component />
          </div>
        </div>
      )}
    </Provider>
  );
};

export default PopupProvider;
