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

// // Handle form submission with validation
// document.getElementById("contact-form")?.addEventListener("submit", async function (e) {
//   e.preventDefault();

//   // Collect form data
//   const formData = {
//     name: document.getElementById("name").value.trim(),
//     company: document.getElementById("company").value.trim(),
//     whatsapp: document.getElementById("whatsapp").value.trim(),
//     email: document.getElementById("email").value.trim(),
//     needs: document.getElementById("needs").value.trim()
//   };

//   // Validate form fields
//   const fields = [
//     { value: formData.name, label: "Nome" },
//     { value: formData.company, label: "Nome da Empresa" },
//     { value: formData.whatsapp, label: "Número de WhatsApp" },
//     { value: formData.email, label: "E-mail" },
//     { value: formData.needs, label: "Descreva suas necessidades" }
//   ];

//   const emptyField = fields.find(field => !field.value);
//   if (emptyField) {
//     alert(`Por favor, preencha o campo ${emptyField.label}.`);
//     return;
//   }

//   // Additional email format validation
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(formData.email)) {
//     alert("Por favor, insira um e-mail válido.");
//     return;
//   }

//   try {
//     const response = await fetch("https://erp.infolinesystems.app.br:8888/InfolineV3.1/rest/contact", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(formData)
//     });

//     if (response.ok) {
//       alert("Formulário enviado com sucesso!");
//       document.getElementById("contact-form").reset();
//     } else {
//       alert("Erro ao enviar o formulário. Tente novamente.");
//     }
//   } catch (error) {
//     console.error("Erro na requisição:", error);
//     alert("Ocorreu um erro. Verifique sua conexão e tente novamente.");
//   }
// });