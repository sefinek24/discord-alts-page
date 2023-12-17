require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const logger = require('./middlewares/morgan.js');
const formatDateToPolish = require('./scripts/formatTime.js');
const fetchUserData = require('./scripts/fetchUserData.js');
const ids = require('./ids.js');

const app = express();

app.set('view engine', 'ejs');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.static('public'));
app.use(logger);


app.get('/', async (req, res) => {
	try {
		const userDataPromises = ids.map(async data => {
			const categoryData = {
				category: data.category,
				users: [],
			};

			const userPromises = data.users.map(async user => {
				const userId = user.userId || null;
				const email = user.email || null;
				const description = user.description || null;

				const userData = await fetchUserData(userId);
				return { ...userData, email, description };
			});

			categoryData.users = await Promise.all(userPromises);
			return categoryData;
		});

		const userDataLists = await Promise.all(userDataPromises);
		res.render('index.ejs', { userDataLists, formatDateToPolish });
	} catch (err) {
		console.error('An error occurred:', err);
		res.status(500).send('Internal Server Error');
	}
});


app.listen(process.env.PORT, () => {
	console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
});