const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Debe tener titulo string'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string({
    invalid_type_error: 'Director tener titulo string'
  }),
  duration: z.number(),
  poster: z.string({
    invalid_type_error: 'Poster tener titulo string'
  }),
  genre: z.array(z.string()),
  rate: z.number().default(5.5)
})

function validateMovie (object) {
  return movieSchema.safeParse(object)
}

function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}
