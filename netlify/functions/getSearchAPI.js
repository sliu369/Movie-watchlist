export async function handler(event, context) {
    try {
      const API_KEY = process.env.API_KEY   // 👈 stored in Netlify env vars
      const query = event.queryStringParameters.query
  
      // Call your API with the secret key
      const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`)
      const data = await response.json()
  
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      }
    }
  }
  