const [emailForm, OTPForm] = document.querySelectorAll(".form");
let email = "";

const queryParams = new URLSearchParams(location.search);
emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const inputEmail = emailForm.email.value;
  if (!inputEmail) return alert("Please enter your email");

  const response = await fetch("/api/v1/otp/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: inputEmail }),
  });
  if (response.ok) {
    OTPForm.classList.remove("hidden");
    emailForm.classList.add("hidden");
    email = inputEmail;
    return;
  }
  alert("Failed to send OTP");
});

OTPForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const otp = OTPForm.otp.value;

  if (!otp || !email) return alert("Please enter your otp");

  const response = await fetch(`/api/v1/otp/verify?${queryParams.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });
  if (response.ok) {
    window.open(`/api/v1/auth/authorize?${queryParams.toString()}`, "_self");
    return;
  }
  alert("Failed to verify OTP");
});
