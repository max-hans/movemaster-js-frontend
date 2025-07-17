import axios from "axios";
import { useCallback, useState } from "react";
import { useInterval } from "react-use";
import type { Position } from "@/lib/api";

const useRobot = () => {
  const [backendUrl, setBackendUrl] = useState("http://localhost:5123");

  const [isConnected, setIsConnected] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [isGripperOpen, setIsGripperOpen] = useState(false);
  const [toolLength, setToolLength] = useState(-1);
  const [speed, setSpeed] = useState(-1);
  const [serialports, setSerialports] = useState<string[]>([]);
  const connect = async (port: string) => {
    await axios.post(`${backendUrl}/connect`, { port });
    await queryUpdate();
  };

  const queryUpdate = useCallback(async () => {
    try {
      const status = await axios.get(`${backendUrl}/status`);
      const { isConnected, position, gripperOpen, toolLength, speed } =
        status.data;
      setIsConnected(isConnected);
      setPosition(position);
      setIsGripperOpen(gripperOpen);
      setToolLength(toolLength);
      setSpeed(speed);
    } catch (error) {
      console.error("Failed to fetch robot status:", error);
      setIsConnected(false);
      setPosition(null);
      setToolLength(-1);
      setSpeed(-1);
    }
  }, [backendUrl]);

  useInterval(queryUpdate, 1000);

  const checkConnected = useCallback(() => {
    if (!isConnected) {
      throw new Error("Robot is not connected");
    }
  }, [isConnected]);

  const moveTo = useCallback(
    async (position: Position) => {
      checkConnected();
      const response = await axios.post(`${backendUrl}/move`, { position });
      setPosition(position);
      console.log("Robot moved to position:", position);
      return response.data;
    },
    [backendUrl, checkConnected]
  );

  const disconnect = useCallback(async () => {
    checkConnected();
    await axios.post(`${backendUrl}/disconnect`);
    setIsConnected(false);
  }, [backendUrl, checkConnected]);

  const requestUpdatePosition = useCallback(async () => {
    if (!isConnected) {
      throw new Error("Robot is not connected");
    }
    await axios.get(`${backendUrl}/request-position`);
    await queryUpdate();
  }, [backendUrl, isConnected, queryUpdate]);

  const moveContinuous = useCallback(
    async (positions: Position[]) => {
      checkConnected();

      await axios.post(`${backendUrl}/move-continuous`, {
        positions,
      });
    },
    [backendUrl, checkConnected]
  );

  const setGripper = async (open: boolean) => {
    checkConnected();
    await axios.post(`${backendUrl}/set-gripper`, { open });
    setIsGripperOpen(open);
  };

  const updateToolLength = async (length: number) => {
    checkConnected();
    await axios.post(`${backendUrl}/tool-length`, { length });
  };

  useInterval(
    async () => {
      try {
        const response = await axios.get(`${backendUrl}/serialports`);
        setSerialports(response.data.ports);
      } catch (error) {
        console.error("Error fetching serial ports:", error);
      }
    },
    !isConnected ? 1000 : null
  );

  return {
    setBackendUrl,
    connect,
    isConnected,
    moveTo,
    disconnect,
    position,
    moveContinuous,
    setGripper,
    isGripperOpen,
    updateToolLength,
    requestUpdatePosition,
    serialports,
  };
};

export default useRobot;
