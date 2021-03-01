import { Api } from "client/services";
import { Bookmark } from "core/models";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

export const Dashboard: React.FC = () => {
	const { data, isLoading } = useQuery("bookmarks", async () => {
		const response = await Api.get("/api/bookmarks");
		const data = (await response.json()) as { results: Bookmark[] };
		return data;
	});

	if (isLoading) return <p>Loading...</p>;

	return (
		<>
			<a href={`${API_URL}/api/logout`}>Log out</a>
			<h1>Bookmarks</h1>
			{data?.results.length ? (
				<ul>
					{data.results.map((x) => (
						<li key={x.id}>
							<a href={x.url}>
								<span>{x.url}</span> - <span>{x.title}</span>
							</a>
						</li>
					))}
				</ul>
			) : (
				<p>No bookmarks</p>
			)}
			<Link to="/create-bookmark">Add bookmark</Link>
		</>
	);
};
