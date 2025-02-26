function drawButton() {
	const issueIdMatch = window.location.pathname.match(/\/issues\/(\d+)/);
	if (!issueIdMatch) { return };
	const issueId = issueIdMatch[1];
	const statusDiv = document.querySelector("div.status.attribute div.value");
	if (!statusDiv) {
      console.warn("Status element not found");
      return;
    }
	const status = statusDiv.textContent.trim();
	if (status !== "New"){ return };
    if (document.getElementById("start-task-btn")) { return };
	const button = document.createElement("button");
    button.id = "start-task-btn";
    button.textContent = "Start Task";
    button.style.marginLeft = "10px";
	statusDiv.appendChild(button);
	button.addEventListener("click", function() {
      button.disabled = true;
      button.textContent = "Updating...";

      const tokenInput = document.querySelector('input[name="authenticity_token"]');
      if (!tokenInput) {
        console.error("Authenticity token not found");
        button.disabled = false;
        button.textContent = "Start Task";
        return;
      }
      const authenticity_token = tokenInput.value;

      const formData = new URLSearchParams();
      formData.append('_method', 'patch');
      formData.append('authenticity_token', authenticity_token);
      formData.append('issue[status_id]', '2');

      const requestUrl = window.location.origin + "/issues/" + issueId;

      fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString(),
        credentials: "include"
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        statusDiv.textContent = "In Progress";
        button.remove();
      })
      .catch(error => {
        console.error("Error updating status:", error);
        button.disabled = false;
        button.textContent = "Start Task";
        alert("Failed to update issue status. Please try again.");
      });
    });
};

drawButton();
