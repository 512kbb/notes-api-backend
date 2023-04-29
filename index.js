// import http from 'http'
import { notes } from './notes.js'
import express from 'express'
import cors from 'cors'
const app = express()

app.use(cors())
app.use(express.json())

app.use((request, response, next) => {
  console.log(request.method)
  console.log(request.path)
  console.log(request.body)
  console.log('---')
  next()
})

let localNotes = notes

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(localNotes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const note = localNotes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  localNotes = localNotes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  if (!note || !note.content) return response.status(400).json({ error: 'note.content is missing' })
  const newNote = {
    id: Math.max(...localNotes.map(note => note.id)) + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  // localNotes = localNotes.concat(newNote)
  localNotes = [...localNotes, newNote]
  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({ error: 'not found' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
