import logo from "@assets/img/logo.svg";

export default function Sidebar() {
	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
			<header className="flex flex-col items-center justify-center text-white">
				<img
					src={logo}
					className="h-36 pointer-events-none animate-spin-slow"
					alt="logo"
				/>
				<p>
					Edit <code>src/pages/sidebar/Sidebar.jsx</code> and save to reload.
				</p>
				<a
					className="text-blue-400"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React!
				</a>
				<p>Sidebar styled with TailwindCSS!</p>
			</header>
		</div>
	);
}
