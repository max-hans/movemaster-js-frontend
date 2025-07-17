import type { FunctionComponent } from "react";
import PanelCard from "@/components/PanelCard";
import useRobot from "@/hooks/useRobot";

const StatusPanel: FunctionComponent = () => {
	const { position, isConnected } = useRobot();
	return (
		<PanelCard title="Backend">
			<div className="gap-4 flex flex-col">
				<div className="flex flex-col">
					<h2>Connected</h2>
					{isConnected ? (
						<p>Port connected</p>
					) : (
						<p className="text-gray-500">No port connected</p>
					)}
				</div>
				<div className="flex flex-col">
					<h2>Position</h2>
					{position ? (
						<div className="grid grid-cols-5 gap-4 w-full">
							<p>{position.x}</p>
							<p>{position.y}</p>
							<p>{position.z}</p>
							<p>{position.p}</p>
							<p>{position.r}</p>
						</div>
					) : (
						<p className="text-gray-500">No position data available</p>
					)}
				</div>
			</div>
		</PanelCard>
	);
};

export default StatusPanel;
