const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./scheme/movies')

const app = express()
app.disable('x-powered-by')

app.use(express.json())

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const pelisFiltradas = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(pelisFiltradas)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const peli = movies.find(peli => peli.id === id)
  if (peli) return res.json(peli)

  res.status(404).json({ message: 'Nom sta' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

// PATCH

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const peli = movies.findIndex(peli => peli.id === id)

  if (peli === -1) {
    res.status(404).json({ message: 'Nom sta' })
  }

  const updateMovie = {
    ...movies[peli],
    ...result.data
  }
  movies[peli] = updateMovie

  res.status(201).json(updateMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log('escuchando en http://localhost:1234')
})
