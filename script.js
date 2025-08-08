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

// Smooth scrolling for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Handle form submission with validation for Web3Forms
document.getElementById("contact-form")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Collect form data
  const formData = new FormData();
  const fields = {
    nome: document.getElementById("nome").value.trim(),
    empresa: document.getElementById("empresa").value.trim(),
    whatsapp: document.getElementById("whatsapp").value.trim(),
    email: document.getElementById("email").value.trim(),
    necessidades: document.getElementById("necessidades").value.trim()
  };

  // Validate form fields
  const fieldLabels = [
    { value: fields.nome, label: "Nome" },
    { value: fields.empresa, label: "Nome da Empresa" },
    { value: fields.whatsapp, label: "Número de WhatsApp" },
    { value: fields.email, label: "E-mail" },
    { value: fields.necessidades, label: "Descreva suas necessidades" }
  ];

  const emptyField = fieldLabels.find(field => !field.value);
  if (emptyField) {
    alert(`Por favor, preencha o campo ${emptyField.label}.`);
    return;
  }

  // Additional email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email)) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }

  // Append form data for Web3Forms
  formData.append("access_key", "5ffe5906-4956-49d1-97e0-56a6139028e5");
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    if (response.ok) {
      // Show success popup
      const popup = document.getElementById("success-popup");
      popup.classList.remove("hidden");
      popup.classList.add("flex");
      
    } else {
      alert(`Erro ao enviar o formulário: ${result.message || "Tente novamente."}`);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    alert("Ocorreu um erro. Verifique sua conexão e tente novamente.");
  }
});

// Close popup on button click
document.getElementById("close-popup")?.addEventListener("click", function () {
  const popup = document.getElementById("success-popup");
  popup.classList.add("hidden");
  popup.classList.remove("flex");
  document.getElementById("contact-form").reset();
});