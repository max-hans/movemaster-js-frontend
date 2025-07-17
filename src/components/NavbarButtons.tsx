import { ChevronDown, Settings, Wifi, WifiOff } from "lucide-react";
import { type FunctionComponent, useState, useTransition } from "react";
import useRobot from "@/hooks/useRobot";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const NavbarButtons: FunctionComponent = () => {
	const { isConnected, connect, setBackendUrl: updateBackendUrl } = useRobot();

	const [comPort, setComPort] = useState("COM3");
	const [backendUrl, setBackendUrl] = useState("http://localhost:5135");

	const [isConnecting, startConnectingTransition] = useTransition();

	const handleConnect = () => {
		startConnectingTransition(() => {
			connect(comPort)
				.then(() => {
					console.log("Connected successfully");
				})
				.catch((error) => {
					console.error("Connection failed:", error);
				});
		});
	};

	const handleBackendSave = () => {
		updateBackendUrl(backendUrl);
	};

	return (
		<div className="flex flex-row gap-4">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button className="">
						<Settings className="w-4 h-4" />
						Backend
						<ChevronDown className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="p-4 gap-2 flex flex-col">
					<input
						type="text"
						value={backendUrl}
						onChange={(e) => setBackendUrl(e.target.value)}
						className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-sm focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20"
						placeholder="http://localhost:5135"
					/>
					<Button onClick={handleBackendSave}>Save</Button>
				</DropdownMenuContent>
			</DropdownMenu>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button>
						{isConnected ? (
							<Wifi className="w-4 h-4" />
						) : (
							<WifiOff className="w-4 h-4" />
						)}
						<span className={isConnected ? "text-gray-900" : "text-gray-400"}>
							{isConnected ? "Connected" : "Disconnected"}
						</span>
						<ChevronDown className="w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="p-4 gap-2 flex flex-col">
					<div className="flex items-center gap-2 mb-3">
						<span className="text-sm font-mono text-gray-500">Status:</span>
						<span
							className={`text-sm font-mono ${
								isConnected ? "text-gray-900" : "text-gray-400"
							}`}
						>
							{isConnected ? "● Connected" : "● Disconnected"}
						</span>
					</div>

					{!isConnected ? (
						<>
							<div>
								<label className="block text-sm font-mono text-gray-600 mb-2">
									COM Port
								</label>
								<input
									type="text"
									value={comPort}
									onChange={(e) => setComPort(e.target.value)}
									className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-sm focus:border-gray-800 focus:ring-1 focus:ring-gray-800/20"
									placeholder="COM3"
								/>
							</div>
							<Button onClick={handleConnect}>
								{isConnecting ? "Connecting..." : "Connect"}
							</Button>
						</>
					) : (
						<Button /* onClick={handleDisconnect} */>Disconnect</Button>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default NavbarButtons;
