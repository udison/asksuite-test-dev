const { getBrowser, closeBrowser } = require('./BrowserService');

class RoomService {

	static reverseDate(date) {
		return date.split('-').reverse().join()
	}

	static getUrl(checkin, checkout) {
		checkin = this.reverseDate(checkin);
		checkout = this.reverseDate(checkout);

		return `https://book.omnibees.com/hotelresults?CheckIn=${checkin.replace(/-/g, '')}&CheckOut=${checkout.replace(/-/g, '')}&Code=AMIGODODANIEL&NRooms=1&_askSI=d34b1c89-78d2-45f3-81ac-4af2c3edb220&ad=2&ag=-&c=2983&ch=0&diff=false&group_code=&lang=pt-BR&loyality_card=&utm_source=asksuite&q=5462#show-more-hotel-button%3C/pre%3E`;
	}

	static async getRooms(checkin, checkout) {
		const browser = await getBrowser();
		const page = await browser.newPage();
		const url = RoomService.getUrl(checkin, checkout);

		await page.goto(url);

		// Gets all the available rooms
		const rooms = await page.evaluate(() => {

			// NodeList of available rooms divs
			const divList = [...document.querySelectorAll('#hotels_grid .roomrate:not(.d-none)')];
		
			// Returns an array of room objects
			return divList.map((div) => {
				let room = {};

				// Room name
				room.name = div.getElementsByClassName('hotel_name')[0].innerText;

				// Room description
				room.description = div.getElementsByClassName('description')[0].innerText;

				// Room price
				let { price } = div.getElementsByClassName('rate_plan')[0].dataset;

				// Currency formatting
				price = Number(price).toLocaleString('pt-BR', {
					style: 'currency',
					currency: 'BRL'
				});

				room.price = price;

				// Room image
				room.image = div.getElementsByClassName('image-step2')[0].src;

				return room;
			});
		});

		closeBrowser(browser);
		return rooms;
	}

}

module.exports = RoomService;