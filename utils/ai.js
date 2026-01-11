import { generateText } from "ai"
import { google } from "@ai-sdk/google"

async function getPlantInfoByImageAi(ImageSrc,region) {

  const inputText=  `region: ${region} `

  const { steps } = await generateText({
    model: google("gemini-2.5-flash"),
    system: `You are an Expert AI assistant for identiying and tracking health of plants through Images,
  
    your job is to identify plant through Images ,Provide some general information about the Plant, provide information about current health of the plant according to image and suggestions for keeping Plant healthy threafter and also give it a title.

    IMPORTANT:
    - Respond with only valid raw JSON.
    - Do NOT include markdown, numbering , or any extra formatting.
    - The format must be a raw JSON object.
 
    give response in following JSON format according to provided image

    {
    "plantName": "General name of the Plant , only plant name without any extra text or brackets, must be short",
    "scientificName": "Scientific name of the plant",
    "title": "Short title including plant name and current condition",
    "generalInfo": "general Information about the plant ",
    "currentCondition": "current health of the plant",
    "suggestions": "Suggestions for keeping plant healthy, general care and according to current condition of the plant without any markdown or numbering",
    "regionalNames": "regional names according to the region, seperated by commas without any markdown" ,
    }

    all fields title, info, current, suggestions should be in String format, plain text without any numbering or markdown (sentence or paragraph), include organic tips in suggestions

    Respond ONLY in this JSON format 

    respond accordingly if input image do not contain plant images or do not contain proper images for identification and analyis 

    `,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: inputText },
          { type: "image", image: ImageSrc }
        ]
      }
    ],
  })

  const raw = steps[0]?.content[0]?.text
  console.log(raw,typeof raw)

   try {
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i)

    const jsonString = match ? match[1] : raw.trim()
    console.log(jsonString)
    return JSON.parse(jsonString)
  } catch (error) {
    console.log("Failed to parse JSON from AI response " + error.message)
    return null 
  }
}

async function getPlantInfoByNameAi(plantName,region) {

  const inputText = `plantName: ${plantName},
  region: ${region}`

  const { steps } = await generateText({
    model: google("gemini-2.5-flash"),
    system: `You are an Expert AI assistant for identiying and tracking health of plants through Images,
  
    your job is to identify plant through Images ,Provide some general information about the Plant, provide information about current health of the plant according to image and suggestions for keeping Plant healthy threafter and also give it a title 

    IMPORTANT:
    - Respond with only valid raw JSON.
    - Do NOT include markdown, numbering or any extra formatting.
    - The format must be a raw JSON object.
 
    give response in following JSON format: 

    {
    "plantName": "General name of the Plant",
    "scientificName": "Scientific name of the plant",
    "title": "Short title including plant name",
    "regionalNames": "regional name accrding to the region provided seperated by commas ,
    "generalInfo": "general Information about the plant",
    "suggestions": "Suggestions for keeping plant healthy"
    } 

    all fields title, info, current, suggestions should be String(sentence or paragraph)

    Respond ONLY in this JSON format and do not include any other text or markdown or numbering in reponse or any field in JSON
    
    `,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: inputText },
        ]
      }
    ],
  })

  const raw = steps[0].content[0].text
  console.log(raw)

   try {
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/i)
    const jsonString = match ? match[1] : raw.trim()
    return JSON.parse(jsonString)
  } catch (error) {
    console.log("Failed to parse JSON from AI response " + error.message)
    return null
  }
}

export { 
  getPlantInfoByImageAi, 
  getPlantInfoByNameAi 
}
