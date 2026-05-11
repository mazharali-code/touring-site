const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const { get } = require('http');
const app = express();

//midddleware
app.use(morgan('dev'));
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'),
);

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
};

const getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid ID' });
  }
  res.status(200).json({ status: 'success', data: { tour } });
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);
    if (!tour) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Invalid ID' });
    }
    // Update the tour with the new data from req.body
    Object.assign(tour, req.body);
    res.status(200).json({ status: 'success', data: { tour } });
  };

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const tourIndex = tours.findIndex((el) => el.id === id);
  if (tourIndex === -1) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid ID' });
  }
  //tours.splice(tourIndex, 1);
  res.status(204).json({ status: 'success', data: null });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res
          .status(500)
          .json({ status: 'error', message: 'Could not save the tour' });
        return;
      }
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    },
  );
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
//app.route('/api/v1/users').get(getAllUsers).post(createUser);
//app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
