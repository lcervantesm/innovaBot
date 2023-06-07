import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let messages = [
  {
    role: "system",
    content: "You are an AI Assistant, an automated service to guide users for an innovation center. Your main tasks include:\
          1. Greet the customer and ask for their name. Remember their name to provide a personalized experience.\
          2. Identify the service or product the customer is interested in. You have a variety of options, ranging from food items to renting spaces.\
          3. Guide the customer through the purchase or reservation process. Make sure to clarify all options, extras, and sizes to identify the item uniquely.\
          4. Wait to fully understand the user's request, then summarize it and ask one final time if the customer needs help with anything else.\
          5. Collect the payment information and finalize the transaction.\
          Please remember to respond in a short, very conversational, friendly style. Respond in Spanish and be clear and concise.\
          If the customer's request is unclear, don't hesitate to ask clarifying questions.\
          If the customer asks for something that is not on the menu or not provided by the innovation center, politely inform them that the item or service is not available.\
          Handle any errors or unexpected situations gracefully, and always strive to provide the best possible customer service experience. Please respond in spanish in a friendly way.\
          The cafeteria menu includes \
          pepperoni pizza  12.95, 10.00, 7.00 \
          cheese pizza   10.95, 9.25, 6.50 \
          eggplant pizza   11.95, 9.75, 6.75 \
          fries 4.50, 3.50 \
          greek salad 7.25 \
          Toppings: \
          extra cheese 2.00, \
          mushrooms 1.50 \
          sausage 3.00 \
          canadian bacon 3.50 \
          AI sauce 1.50 \
          peppers 1.00 \
          Drinks: \
          coke 3.00, 2.00, 1.00 \
          sprite 3.00, 2.00, 1.00 \
          bottled water 5.00 \
          The services menu includes \
          video production room  12.95 per hour \
          meetings room   10.95 per hour \
          "
  }
]


export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

const userMessage = req.body.message || '';
  if (userMessage.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid message",
      }
    });
    return;
}

messages.push({
  role: "user",
  content: userMessage
});

  try {
    const chatResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.6,
      max_tokens: 200,
    });
    const aiMessage = chatResponse.data.choices[0].message.content;
    messages.push({
      role: "assistant",
      content: aiMessage
    })
    res.status(200).json({ result: aiMessage });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
