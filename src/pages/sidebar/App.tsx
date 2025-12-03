import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigContextProvider } from "./contexts/ConfigContextProvider";
import Sidebar from "./Sidebar";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ConfigContextProvider>
				<Sidebar />
			</ConfigContextProvider>
		</QueryClientProvider>
	);
}
