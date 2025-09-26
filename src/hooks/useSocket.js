import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(url);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  const emit = (event, data) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event, callback) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event, callback) => {
    socketRef.current?.off(event, callback);
  };

  return { socket: socketRef.current, isConnected, emit, on, off };
};