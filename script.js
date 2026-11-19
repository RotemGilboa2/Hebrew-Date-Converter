const form = document.getElementById("converter-form");
const result = document.getElementById("hebrew-date");
const errorMessage = document.getElementById("error-message");
const convertButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const date = formData.get("date");
  const sunset = formData.get("sunset");

  result.textContent = "";
  errorMessage.textContent = "";
  convertButton.disabled = true;
  convertButton.textContent = "Converting…";

  try {
    result.textContent = await convertToHebrewDate(date, sunset);
  } catch {
    errorMessage.textContent = "Could not convert the date. Please try again.";
  } finally {
    convertButton.disabled = false;
    convertButton.textContent = "Convert date";
  }
});

async function convertToHebrewDate(date, sunset) {
  const url = new URL("https://www.hebcal.com/converter");

  url.searchParams.set("cfg", "json");
  url.searchParams.set("g2h", "1");
  url.searchParams.set("date", date);
  url.searchParams.set("strict", "1");

  if (sunset === "after") {
    url.searchParams.set("gs", "on");
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Hebcal request failed.");
  }

  const data = await response.json();
  return data.hebrew;
}