import express from 'express';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import jacketMeasurementRoutes from './routes/jacketMeasurementRoutes.js';
import shirtMeasurementRoutes from './routes/shirtMeasurementRoutes.js';
import pantMeasurementRoutes from './routes/pantMeasurementRoutes.js';
import itemsRoutes from './routes/itemsRoutes.js';

const app = express();

app.use(cors());

/*
app.use(cors({
    origin: 'http://example.com'  // Replace 'http://example.com' with the URL of your front-end app
}));
 */


app.use(express.json()); // to parse JSON bodies

//use the routes
app.use(customerRoutes);
app.use(orderRoutes);
app.use(jacketMeasurementRoutes);
app.use(shirtMeasurementRoutes);
app.use(pantMeasurementRoutes);
app.use(itemsRoutes);


//ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

//START SERVER
app.listen(8080, () => {
    console.log('Server is running on port 8080');
})