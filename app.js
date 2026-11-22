
const form = document.getElementById("movement-form");
const movementList = document.getElementById("movement-list");

let movements = JSON.parse(localStorage.getItem("cro_movements")) || [];

function money(value) {
    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN"
    }).format(value);
}

function render() {
    let income = 0;
    let expenses = 0;

    movements.forEach(movement => {
        if (movement.type === "income") {
            income += movement.amount;
        } else {
            expenses += movement.amount;
        }
    });

    document.getElementById("balance").textContent = money(income - expenses);
    document.getElementById("income").textContent = money(income);
    document.getElementById("expenses").textContent = money(expenses);
    document.getElementById("total-movements").textContent = movements.length;

    if (movements.length === 0) {
        movementList.innerHTML = '<p class="empty">Todavía no tienes movimientos registrados.</p>';
        return;
    }

    movementList.innerHTML = movements.map(movement => `
        <div class="movement">
            <div>
                <strong>${escapeHTML(movement.description)}</strong>
                <small>${escapeHTML(movement.category)} · ${movement.date}</small>
                <button class="delete-btn" onclick="deleteMovement('${movement.id}')">Eliminar</button>
            </div>

            <strong class="${movement.type}">
                ${movement.type === "income" ? "+" : "-"}${money(movement.amount)}
            </strong>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const description = document.getElementById("description").value.trim();
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        return;
    }

    movements.unshift({
        id: crypto.randomUUID(),
        description,
        amount,
        type,
        category,
        date: new Date().toLocaleDateString("es-MX")
    });

    localStorage.setItem("cro_movements", JSON.stringify(movements));

    form.reset();
    render();
});

function deleteMovement(id) {
    movements = movements.filter(movement => movement.id !== id);
    localStorage.setItem("cro_movements", JSON.stringify(movements));
    render();
}

document.getElementById("current-date").textContent =
    new Date().toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

render();
