import { useEffect, useState } from "react";

const PREFIX = "whatsapp-clone-";

export default function useLocalStorage(key, initialValue) {
  const prefixKey = PREFIX + key;
  const [value, setValue] = useState(() => {
    const rawValue = localStorage.getItem(prefixKey);
    if (rawValue != null) return JSON.parse(rawValue);

    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(prefixKey, JSON.stringify(value));
  }, [value, prefixKey]);

  return [value, setValue];
}
