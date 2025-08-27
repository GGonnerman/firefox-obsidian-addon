import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Inner from "./Inner";

export default function Sidebar() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<Inner />
		</QueryClientProvider>
	);
}
