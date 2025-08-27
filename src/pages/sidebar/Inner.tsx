/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import { useEffect, useState } from "react";

export default function Inner() {
	const [apiKey, setApiKey] = useState<string>("");

	useEffect(() => {
		setApiKey(localStorage.getItem("api-key") || "");
	}, []);

	const [data, setData] = useState<{ message: string; status: string }>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("https://dog.ceo/api/breeds/image/random");
				const result = await response.json();
				setData(result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div>
			<h1>API Data</h1>
			{data ? (
				<div>
					<p>{data.status}</p>
					<img src={data.message} />
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
