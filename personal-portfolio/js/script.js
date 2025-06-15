// Password protected resume download
const RESUME_PASSWORD = "meet@1234";

function handleResumeDownload() {
  const input = prompt("Enter the résumé password:");
  if (input === RESUME_PASSWORD) {
    window.location.href = "resume.pdf";
  } else {
    alert("Incorrect password. Please try again.");
  }
}

// Bind the click event after the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const resumeButton = document.getElementById("resumeButton");
  if (resumeButton) {
    resumeButton.addEventListener("click", handleResumeDownload);
  }
});
