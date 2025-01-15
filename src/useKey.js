import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(() => {
    function callBack(e) {
      if (e.code && e.code.toLowerCase() === key.toLowerCase()) {
        action();
        // onCloseMovie();
      }
    }

    document.addEventListener("keydown", callBack);
    //clean up function
    return function () {
      document.removeEventListener("keydown", callBack);
    };
  }, [action, key]);
}
