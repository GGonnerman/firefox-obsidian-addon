import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Sidebar from "./Sidebar";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Sidebar />
			<ReactQueryDevtools initialIsOpen={true} position="top-left" />
		</QueryClientProvider>
	);
}
