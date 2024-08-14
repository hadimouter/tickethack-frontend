// Set date default value to today
document.querySelector('#date').valueAsDate = new Date();

function updateTripBookingEventListener() {
  for (let i = 0; i < document.querySelectorAll('.book').length; i++) {
    document.querySelectorAll('.book')[i].addEventListener('click', function () {
      fetch('http://localhost:3000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: this.id }),
      })
        .then(response => response.json())
        .then(data => {
          data.result && window.location.assign('cart.html');
        });
    });
  }
}

// Search
document.querySelector('#search').addEventListener('click', function () {
  const departure = document.querySelector('#departure').value;
  const arrival = document.querySelector('#arrival').value;
  const date = document.querySelector('#date').value;

  if (!departure || !arrival || !date) {
    return;
  }

  fetch(`http://localhost:3000/search/${departure}/${arrival}/${date}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.result) {
        document.querySelector('#results').innerHTML = '';

        // Update results
        for (const trip of data.trips) {
          document.querySelector('#results').innerHTML += `
					  <div class="trip">
						  <span>${trip.departure} > ${trip.arrival}</span> 
							<span>${moment(trip.date).format('HH:mm')}</span>  
							<span class="price">${trip.price}€</span>
							<button class="book" id="${trip._id}">Book</button>
						</div>
					`;
          document.querySelector('#results').style.justifyContent = "flex-start";

        }

        updateTripBookingEventListener();
      } else {
        document.querySelector('#results').innerHTML = `
					<img id="results-logo" src="images/notfound.png"/>
					<div class="divider green"></div>
					<span>No trip found.</span>
				`;
      }
    });
});
