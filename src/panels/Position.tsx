import { type FunctionComponent, useState } from "react";
import PanelCard from "@/components/PanelCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRobot from "@/hooks/useRobot";
import type { Position } from "@/lib/api";

const homePosition: Position = {
	x: 0,
	y: 400,
	z: 200,
	p: 0,
	r: 0,
};

const PositionPanel: FunctionComponent = () => {
	const { moveTo, isConnected } = useRobot();

	const [newPosition, setNewPosition] = useState<Position>({ ...homePosition });
	return (
		<PanelCard title="Position">
			<div className="grid grid-cols-3 gap-2">
				<Input
					type="number"
					value={newPosition.x}
					placeholder="X"
					name="x"
					onChange={(e) =>
						setNewPosition((pos) => ({ ...pos, x: parseFloat(e.target.value) }))
					}
				/>
				<Input
					type="number"
					value={newPosition.y}
					placeholder="Y"
					name="y"
					onChange={(e) =>
						setNewPosition((pos) => ({ ...pos, y: parseFloat(e.target.value) }))
					}
				/>
				<Input
					type="number"
					value={newPosition.z}
					placeholder="Z"
					name="z"
					onChange={(e) =>
						setNewPosition((pos) => ({ ...pos, z: parseFloat(e.target.value) }))
					}
				/>
				<Input
					type="number"
					value={newPosition.p}
					placeholder="P"
					name="p"
					onChange={(e) =>
						setNewPosition((pos) => ({ ...pos, p: parseFloat(e.target.value) }))
					}
				/>
				<Input
					type="number"
					value={newPosition.r}
					placeholder="R"
					name="r"
					onChange={(e) =>
						setNewPosition((pos) => ({ ...pos, r: parseFloat(e.target.value) }))
					}
				/>
				<Button
					onClick={() =>
						moveTo(newPosition).catch((error) => {
							console.error("Failed to move robot:", error);
						})
					}
					className="col-span-full"
					disabled={!isConnected}
				>
					Move
				</Button>
			</div>
		</PanelCard>
	);
};

export default PositionPanel;
