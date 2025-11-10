const isBrowser = () => typeof window !== "undefined";

export function saveToLocalStorage(state) {
  if (!isBrowser()) {
    return;
  }
  try {
    const serializedState = JSON.stringify(state);
    window.sessionStorage.setItem("auth", serializedState);
  } catch (e) {
    console.log(e);
  }
}

export function loadFromLocalStorage() {
  if (!isBrowser()) {
    return undefined;
  }
  try {
    const serializedState = window.sessionStorage.getItem("auth");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export const removeSessionStorage = (key) => {
  if (!isBrowser()) {
    return;
  }
  try {
    window.sessionStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

export const setSessionStorage = (key, value) => {
  if (!isBrowser()) {
    return;
  }
  window.sessionStorage.setItem(key, value);
};

export const getSessionStorage = (key) => {
  if (!isBrowser()) {
    return undefined;
  }
  return window.sessionStorage.getItem(key);
};
