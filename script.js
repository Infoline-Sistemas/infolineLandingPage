const toggle = document.getElementById("toggle");
if (toggle) {
  toggle.addEventListener("change", () => {
    document.getElementById("html").classList.toggle("dark");
    console.log(
      "Dark mode:",
      document.documentElement.classList.contains("dark"),
    );
  });
}
