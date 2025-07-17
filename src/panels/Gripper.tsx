import type { FunctionComponent } from "react";
import PanelCard from "@/components/PanelCard";
import { Button } from "@/components/ui/button";
import useRobot from "@/hooks/useRobot";

const GripperPanel: FunctionComponent = () => {
	const { setGripper, isConnected, isGripperOpen } = useRobot();
	return (
		<PanelCard title="Gripper">
			<div className="flex flex-col gap-4">
				<Button
					variant={isGripperOpen ? "secondary" : "default"}
					onClick={() => {
						setGripper(true).catch((error) => {
							console.error("Failed to open gripper:", error);
						});
					}}
					disabled={!isConnected}
				>
					Open
				</Button>
				<Button
					variant={!isGripperOpen ? "secondary" : "default"}
					onClick={() => {
						setGripper(false).catch((error) => {
							console.error("Failed to close gripper:", error);
						});
					}}
					disabled={!isConnected}
				>
					Close
				</Button>
			</div>
		</PanelCard>
	);
};

export default GripperPanel;
