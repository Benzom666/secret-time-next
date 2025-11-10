import { useEffect, useRef } from "react";
import io from "socket.io-client";
import {
  socketURL,
  attachBlobUrlTransformerToSocket,
} from "utils/Utilities";

const useSocket = () => {
  const socketRef = useRef();

  const url = socketURL;

  useEffect(() => {
    // Only initialize socket if URL is configured
    if (!url || url === "undefined" || url === "") {
      console.warn("[useSocket] Socket URL not configured, skipping connection");
      return;
    }

    socketRef.current = attachBlobUrlTransformerToSocket(
      io(url, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      })
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  return socketRef.current;
};

export default useSocket;
