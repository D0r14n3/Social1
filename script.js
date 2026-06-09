// Car Management System

class CarManager {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.loadFromLocalStorage();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayCars();
    }

    setupEventListeners() {
        const form = document.getElementById('carForm');
        const filterMarque = document.getElementById('filterMarque');
        const filterEtat = document.getElementById('filterEtat');
        const btnReset = document.getElementById('btnReset');

        form.addEventListener('submit', (e) => this.handleAddCar(e));
        filterMarque.addEventListener('input', (e) => this.filterCars());
        filterEtat.addEventListener('change', (e) => this.filterCars());
        btnReset.addEventListener('click', (e) => this.resetFilters());
    }

    handleAddCar(e) {
        e.preventDefault();

        const car = {
            id: Date.now(),
            marque: document.getElementById('marque').value,
            modele: document.getElementById('modele').value,
            annee: parseInt(document.getElementById('annee').value),
            couleur: document.getElementById('couleur').value,
            immatriculation: document.getElementById('immatriculation').value,
            kilometrage: parseInt(document.getElementById('kilometrage').value),
            etat: document.getElementById('etat').value
        };

        this.cars.push(car);
        this.saveToLocalStorage();
        this.displayCars();
        document.getElementById('carForm').reset();
        this.showNotification('Voiture ajoutée avec succès!', 'success');
    }

    filterCars() {
        const filterMarque = document.getElementById('filterMarque').value.toLowerCase();
        const filterEtat = document.getElementById('filterEtat').value;

        this.filteredCars = this.cars.filter(car => {
            const matchMarque = car.marque.toLowerCase().includes(filterMarque);
            const matchEtat = filterEtat === '' || car.etat === filterEtat;
            return matchMarque && matchEtat;
        });

        this.displayCars();
    }

    resetFilters() {
        document.getElementById('filterMarque').value = '';
        document.getElementById('filterEtat').value = '';
        this.filteredCars = [...this.cars];
        this.displayCars();
    }

    displayCars() {
        const carsList = document.getElementById('carsList');
        const carCount = document.getElementById('carCount');
        const carsToDisplay = this.filteredCars.length > 0 ? this.filteredCars : this.cars;

        carCount.textContent = carsToDisplay.length;

        if (carsToDisplay.length === 0) {
            carsList.innerHTML = '<div class="empty-state"><p>Aucune voiture disponible. Commencez par en ajouter une!</p></div>';
            return;
        }

        carsList.innerHTML = carsToDisplay.map(car => this.createCarCard(car)).join('');

        // Add event listeners to buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = parseInt(e.target.dataset.id);
                this.deleteCar(carId);
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const carId = parseInt(e.target.dataset.id);
                this.editCar(carId);
            });
        });
    }

    createCarCard(car) {
        const statusClass = `status-${car.etat.toLowerCase().replace(' ', '-')}`;
        return `
            <div class="car-card">
                <div class="car-header">
                    <div class="car-title">${car.marque} ${car.modele}</div>
                    <div class="car-year">${car.annee}</div>
                </div>
                <div class="car-status ${statusClass}">${car.etat}</div>
                <div class="car-details">
                    <div class="car-detail-item">
                        <span class="car-detail-label">Couleur:</span>
                        <span class="car-detail-value">${car.couleur}</span>
                    </div>
                    <div class="car-detail-item">
                        <span class="car-detail-label">Immatriculation:</span>
                        <span class="car-detail-value">${car.immatriculation}</span>
                    </div>
                    <div class="car-detail-item">
                        <span class="car-detail-label">Kilométrage:</span>
                        <span class="car-detail-value">${car.kilometrage.toLocaleString('fr-FR')} km</span>
                    </div>
                </div>
                <div class="car-actions">
                    <button class="btn-edit" data-id="${car.id}">✏️ Modifier</button>
                    <button class="btn-delete" data-id="${car.id}">🗑️ Supprimer</button>
                </div>
            </div>
        `;
    }

    deleteCar(carId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture?')) {
            this.cars = this.cars.filter(car => car.id !== carId);
            this.saveToLocalStorage();
            this.displayCars();
            this.showNotification('Voiture supprimée avec succès!', 'success');
        }
    }

    editCar(carId) {
        const car = this.cars.find(c => c.id === carId);
        if (car) {
            document.getElementById('marque').value = car.marque;
            document.getElementById('modele').value = car.modele;
            document.getElementById('annee').value = car.annee;
            document.getElementById('couleur').value = car.couleur;
            document.getElementById('immatriculation').value = car.immatriculation;
            document.getElementById('kilometrage').value = car.kilometrage;
            document.getElementById('etat').value = car.etat;

            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

            // Remove the old car
            this.cars = this.cars.filter(c => c.id !== carId);
            this.saveToLocalStorage();
            this.displayCars();
            this.showNotification('Modifiez les informations et cliquez sur "Ajouter la Voiture"', 'info');
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('cars', JSON.stringify(this.cars));
    }

    loadFromLocalStorage() {
        const savedCars = localStorage.getItem('cars');
        if (savedCars) {
            this.cars = JSON.parse(savedCars);
        }
        this.filteredCars = [...this.cars];
    }

    showNotification(message, type) {
        // Simple notification (you can enhance this)
        console.log(`[${type.toUpperCase()}] ${message}`);
        // You could create a toast notification here
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarManager();
});