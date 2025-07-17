import type { FunctionComponent } from "react";
import PanelCard from "@/components/PanelCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRobot from "@/hooks/useRobot";

const PositionPanel: FunctionComponent = () => {
	const { moveTo, isConnected } = useRobot();
	return (
		<PanelCard title="Position">
			<form
				className="flex flex-col gap-4"
				autoComplete="off"
				onSubmit={(e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					const position = {
						x: parseFloat(formData.get("x") as string),
						y: parseFloat(formData.get("y") as string),
						z: parseFloat(formData.get("z") as string),
						p: parseFloat(formData.get("p") as string),
						r: parseFloat(formData.get("r") as string),
					};
					moveTo(position).catch((error) => {
						console.error("Failed to move robot:", error);
					});
				}}
			>
				<Input type="number" placeholder="X" name="x" defaultValue={0} />
				<Input type="number" placeholder="Y" name="y" defaultValue={0} />
				<Input type="number" placeholder="Z" name="z" defaultValue={0} />
				<Input type="number" placeholder="P" name="p" defaultValue={0} />
				<Input type="number" placeholder="R" name="r" defaultValue={0} />
				<Button type="submit" disabled={!isConnected}>
					Move
				</Button>
			</form>
		</PanelCard>
	);
};

export default PositionPanel;
