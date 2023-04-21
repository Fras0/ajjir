const PassBtn = document.getElementById("passBtn");

function toggle() {
  const input = document.getElementById("password");
  if (input.getAttribute("type") === "password") {
    input.setAttribute("type", "text");
  } else {
    input.setAttribute("type", "password");
  }

  if (input.getAttribute("type") === "text") {
    PassBtn.innerHTML = '<i class="fa fa-eye-slash"></i>';
  } else {
    PassBtn.innerHTML = '<i class="fa fa-eye fa-fw" aria-hidden="true"></i>';
  }
}

PassBtn.addEventListener("click", toggle);
