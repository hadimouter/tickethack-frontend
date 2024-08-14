function updateRemoveFromCartEventListener() {
  for (let i = 0; i < document.querySelectorAll('.delete').length; i++) {
    document.querySelectorAll('.delete')[i].addEventListener('click', function () {
      fetch(`http://localhost:3000/cart/${this.id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          if (data.result) {
            this.parentNode.remove();

            // Reset cart if all trips have been deleted
            if (document.querySelectorAll('.delete').length === 0) {
              document.querySelector('#cart').innerHTML = `
								<p>No tickets in your cart.</p>
								<p>Why not plan a trip?</p>
							`;
              document.querySelector('#cart2').style.display = 'none';
            } else {
              // Update total
              document.querySelector('#total').textContent = data.bookings.reduce((acc, { trip }) => acc + trip.price, 0);
            }
          }
        });
    });
  }
}

// Get cart
fetch('http://localhost:3000/cart')
  .then(response => response.json())
  .then(data => {
    if (data.result) {
      document.querySelector('#cart2').style.display = 'flex';
      document.querySelector('#cart').innerHTML = '<h4>My cart</h4>';

      // Update cart list
      for (const { trip } of data.bookings) {
        document.querySelector('#cart').innerHTML += `
					<div class="selected-trip">
						${trip.departure} > ${trip.arrival} <span>${moment(trip.date).format('HH:mm')}</span><span class="price">${trip.price}€</span>
						<button class="delete" id="${trip._id}">X</button>
					</div>
				`;
      }

      // Update total
      document.querySelector('#total').textContent = data.bookings.reduce((acc, { trip }) => acc + trip.price, 0);

      updateRemoveFromCartEventListener();
    } else {
      document.querySelector('#cart2').style.display = 'none';
    }
  });

// Purchase
document.querySelector('#purchase').addEventListener('click', function () {
  fetch('http://localhost:3000/bookings', { method: 'PUT' })
    .then(response => response.json())
    .then(data => {
      data.result && window.location.assign('bookings.html');
    });
});
