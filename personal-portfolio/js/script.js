// Password protected resume download
let userPassword = "";

function handleResumeDownload() {
  if (!userPassword) {
    userPassword = prompt("Set your résumé password:");
    if (!userPassword) {
      alert("Password is required to enable résumé download.");
      return;
    }
  }

  const input = prompt("Enter the résumé password:");
  if (input === userPassword) {
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
