const removeButtons = document.querySelectorAll("[data-bookmark-id]");
removeButtons.forEach((rmButton) => {
	rmButton.addEventListener("click", async () => {
		const bookmarkId = rmButton.dataset.bookmarkId;
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		await fetch(`/api/bookmarks/${bookmarkId}`, {
			method: "DELETE",
		}).then(() => {
			window.location.reload();
		});
	});
});

const addButton = document.getElementById("addBookmark");

addButton.addEventListener("click", async () => {
	const url = document.getElementById("url").value;
	await fetch("/api/bookmarks", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ url }),
	}).then(() => {
		window.location.reload();
	});
});
