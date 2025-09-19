// Pie Chart
const ctxPie = document.getElementById('pieChart');
new Chart(ctxPie, {
  type: 'pie',
  data: {
    labels: ['Atendidos', 'Em andamento', 'Dentro do prazo', 'Fora do prazo', 'Não iniciados', 'Urgentes'],
    datasets: [{
      data: [45, 30, 50, 10, 20, 5],
      backgroundColor: ['#22c55e', '#3b82f6', '#86efac', '#ef4444', '#9ca3af', '#f97316']
    }]
  }
});

// Bar Chart
const ctxBar = document.getElementById('barChart');
new Chart(ctxBar, {
  type: 'bar',
  data: {
    labels: ['Janeiro', 'Fevereiro', 'Março'],
    datasets: [
      { label: 'Dentro Prazo', data: [40, 35, 50], backgroundColor: '#22c55e' },
      { label: 'Fora Prazo', data: [10, 15, 5], backgroundColor: '#ef4444' },
      { label: 'Em Andamento', data: [20, 25, 15], backgroundColor: '#3b82f6' }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  }
});
