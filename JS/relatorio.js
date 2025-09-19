const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const responsavelFilter = document.getElementById("responsavelFilter");
const dateFilter = document.getElementById("dateFilter");

const reportCards = document.querySelectorAll(".report-card");

function filterReports() {
  const searchTerm = searchInput.value.toLowerCase();
  const statusValue = statusFilter.value;
  const responsavelValue = responsavelFilter.value;
  const dateValue = dateFilter.value;

  reportCards.forEach(card => {
    const cardStatus = card.getAttribute("data-type");
    const cardText = card.innerText.toLowerCase();

    let matchesDate = true;
    if (dateValue) {
      const dates = Array.from(card.querySelectorAll("td")).map(td => td.innerText);
      const formattedDate = formatDateInput(dateValue);
      matchesDate = dates.some(d => d.includes(formattedDate));
    }

    const matchesStatus = !statusValue || cardStatus === statusValue;
    const matchesResponsavel = !responsavelValue || cardText.includes(responsavelValue.toLowerCase());
    const matchesSearch = cardText.includes(searchTerm);

    card.style.display = (matchesStatus && matchesResponsavel && matchesDate && matchesSearch) ? "block" : "none";
  });
}

function formatDateInput(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

// Eventos
searchInput.addEventListener("input", filterReports);
statusFilter.addEventListener("change", filterReports);
responsavelFilter.addEventListener("change", filterReports);
dateFilter.addEventListener("change", filterReports);
