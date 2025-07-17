import axios from "axios";
import { useState } from "react";
import { useInterval } from "react-use";
import type { Position } from "@/lib/api";

const useRobot = () => {
	const [backendUrl, setBackendUrl] = useState("http://localhost:5123");

	const [isConnected, setIsConnected] = useState(false);
	const [position, setPosition] = useState<Position | null>(null);
	const [isGripperOpen, setIsGripperOpen] = useState(false);

	const connect = async (port: string) => {
		await axios.post(`${backendUrl}/connect`, { port });
		await queryUpdate();
	};

	const queryUpdate = async () => {
		if (isConnected) {
			try {
				const status = await axios.get(`${backendUrl}/status`);
				const { isConnected, position, gripperOpen } = status.data;
				setIsConnected(isConnected);
				setPosition(position);
				setIsGripperOpen(gripperOpen);
			} catch (error) {
				console.error("Failed to fetch robot status:", error);
				setIsConnected(false);
				setPosition(null);
			}
		}
	};

	useInterval(queryUpdate, 1000);

	const moveTo = async (position: Position) => {
		checkConnected();
		const response = await axios.post(`${backendUrl}/move`, position);
		return response.data;
	};

	const disconnect = async () => {
		checkConnected();
		await axios.post(`${backendUrl}/disconnect`);
		setIsConnected(false);
	};

	const checkConnected = () => {
		if (!isConnected) {
			throw new Error("Robot is not connected");
		}
	};

	const moveContinuous = async (positions: Position[]) => {
		checkConnected();

		await axios.post(`${backendUrl}/move-continuous`, {
			positions,
		});
	};

	const setGripper = async (open: boolean) => {
		checkConnected();
		await axios.post(`${backendUrl}/gripper`, { open });
		setIsGripperOpen(open);
	};

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
	};
};

export default useRobot;
