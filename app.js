import {
    SYSTEM_PROMPT,
    PRODUCT_CONTEXT
} from './src/kiroPrompt.js';

// Configuration for different API options
const CONFIG = {
    // Option 1: Use Kiro IDE's built-in AI (recommended for development)
    useKiroIDE: true,

    // Option 2: Free APIs (uncomment and configure as needed)
    // huggingFaceToken: 'YOUR_HF_TOKEN_HERE', // Get free at huggingface.co
    // openaiKey: 'YOUR_OPENAI_KEY_HERE', // $5 free credit for new users

    // Option 3: Local AI (if you have ollama installed)
    // ollamaEndpoint: 'http://localhost:11434/api/generate'
};

/**
 * Main function to handle user queries
 * Combines system prompt + Bengaluru context + user question
 */
async function ask() {
    const question = document.getElementById("input").value.trim();
    const outputElement = document.getElementById("output");
    const askButton = document.getElementById("askButton");

    if (!question) {
        outputElement.textContent = "Please ask me something about Bengaluru life!";
        return;
    }

    // Show loading state
    outputElement.textContent = "Thinking like a local...";
    outputElement.className = "loading";
    askButton.disabled = true;
    askButton.textContent = "Thinking...";

    try {
        // This is where we combine:
        // 1. SYSTEM_PROMPT (defines the assistant's personality)
        // 2. PRODUCT_CONTEXT (Bengaluru-specific knowledge from .kiro/product.md)
        // 3. User's question
        const response = await callKiroAPI(question);

        outputElement.textContent = response;
        outputElement.className = "";
    } catch (error) {
        console.error('Error calling Kiro API:', error);
        outputElement.textContent = `Guru, something went wrong: ${error.message}\n\nFor now, here's a sample local response:\n\n${getSampleResponse(question)}`;
        outputElement.className = "";
    } finally {
        askButton.disabled = false;
        askButton.textContent = "Ask a Local";
    }
}

/**
 * Calls the AI API with the complete context
 * This is where the magic happens - combining system prompt + product context + user query
 */
async function callKiroAPI(userQuestion) {
    // Construct the complete prompt that includes:
    // 1. System instructions (how to behave)
    // 2. Product context (Bengaluru-specific knowledge)
    // 3. User's actual question
    const fullPrompt = `${SYSTEM_PROMPT}

BENGALURU CONTEXT (from .kiro/product.md):
${PRODUCT_CONTEXT}

USER QUESTION: ${userQuestion}

Respond as a Bengaluru local would, using the context above.`;

    // Option 1: Use Kiro IDE's built-in AI (works if you're in Kiro IDE)
    if (CONFIG.useKiroIDE && window.kiro) {
        try {
            const response = await window.kiro.ai.chat(fullPrompt);
            return response;
        } catch (error) {
            console.log('Kiro IDE AI not available, falling back to samples');
        }
    }

    // Option 2: Free Hugging Face API
    if (CONFIG.huggingFaceToken) {
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.huggingFaceToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: fullPrompt,
                    parameters: {
                        max_length: 500,
                        temperature: 0.7
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.generated_text || data[0]?.generated_text || 'No response received';
            }
        } catch (error) {
            console.log('Hugging Face API failed, falling back to samples');
        }
    }

    // Option 3: OpenAI API (has free credits for new users)
    if (CONFIG.openaiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.openaiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: fullPrompt
                    }],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.choices[0]?.message?.content || 'No response received';
            }
        } catch (error) {
            console.log('OpenAI API failed, falling back to samples');
        }
    }

    // Option 4: Local Ollama (if installed)
    if (CONFIG.ollamaEndpoint) {
        try {
            const response = await fetch(CONFIG.ollamaEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama2', // or any model you have installed
                    prompt: fullPrompt,
                    stream: false
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.response || 'No response received';
            }
        } catch (error) {
            console.log('Ollama not available, falling back to samples');
        }
    }

    // Fallback: Use sample responses (always works)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    return getSampleResponse(userQuestion);
}

/**
 * Sample responses that demonstrate the local Bengaluru style
 * This shows how the assistant should sound when using the product context
 */
function getSampleResponse(question) {
    const lowerQuestion = question.toLowerCase();

    // Traffic and Transportation
    if (lowerQuestion.includes('whitefield') && (lowerQuestion.includes('6 pm') || lowerQuestion.includes('evening'))) {
        return `Anna, 6 PM to Whitefield? That's peak traffic suicide!

You'll be stuck in Marathahalli junction for 45 minutes minimum. What Google says is 1 hour will easily become 2 hours.

Better options:
- Leave by 4:30 PM (before the chaos starts)
- Take the metro to Baiyappanahalli, then cab
- Or just work from home if possible

Trust me, I've done this mistake too many times. The ORR after 5:30 PM is not for the weak-hearted.`;
    }

    if (lowerQuestion.includes('orr') || lowerQuestion.includes('outer ring road')) {
        return `ORR? Guru, that depends on the time!

Before 8:30 AM: Smooth sailing
8:30 AM - 11 AM: Slow but manageable
11 AM - 5:30 PM: Your best friend
5:30 PM - 9 PM: Avoid like the plague
After 9 PM: Back to normal

Pro tip: If it's raining, add 30 minutes to whatever Google says. The ORR becomes a parking lot when there's even a drizzle.`;
    }

    if (lowerQuestion.includes('metro') && (lowerQuestion.includes('cab') || lowerQuestion.includes('uber') || lowerQuestion.includes('ola'))) {
        return `Metro vs cab? Smart question, anna!

Metro wins when:
- Peak hours (8-11 AM, 5:30-9 PM)
- Going to MG Road, Cubbon Park, Majestic area
- You're not in a hurry for the last mile

Cab wins when:
- Early morning or late night
- Carrying luggage or going to airport
- The destination is far from metro stations

My rule: If there's a metro station within 1 km of both start and end points, take the metro during peak hours. Otherwise, cab it is.`;
    }

    if (lowerQuestion.includes('silk board') || lowerQuestion.includes('silkboard')) {
        return `Silk Board? Bro, that's the Bermuda Triangle of Bengaluru traffic!

Avoid during:
- 8:30 AM - 11 AM (morning rush)
- 5:30 PM - 9 PM (evening nightmare)
- Any time it's raining

Alternative routes:
- Take Bannerghatta Road if going south
- Use Hosur Road if possible
- Or just reschedule your meeting 😅

Locals have a saying: "Silk Board traffic is so bad, people age while crossing it."`;
    }

    // Food and Safety
    if (lowerQuestion.includes('pani puri') || lowerQuestion.includes('chaat') || lowerQuestion.includes('street food')) {
        return `Street food after dark? Here's the local wisdom:

Safe bets:
- Busy stalls with locals queuing up
- Places that have been around for years
- Idli, dosa, vada stalls (generally safer)

Risky business:
- Empty stalls (no crowd = red flag)
- Cut fruits after sunset
- Pani puri after 9 PM (unless it's VV Puram)

My rule: If there's a queue of office-goers, go for it. If you're the only customer, maybe just get a dosa instead.

"Adjust maadi" as we say, but don't blame me later! 😄`;
    }

    if (lowerQuestion.includes('delivery') && lowerQuestion.includes('rain')) {
        return `Food delivery during rain? Anna, you're testing the delivery guy's patience!

Reality check:
- Delivery time doubles (30 min becomes 1 hour)
- Many restaurants stop accepting orders
- Delivery charges go up
- Food might get soggy

Better options:
- Order before the rain starts
- Keep some Maggi at home for emergencies
- Check if your nearby Darshini is open

Pro tip: Swiggy/Zomato surge pricing during rain is real. That ₹200 biryani becomes ₹350 real quick!`;
    }

    if (lowerQuestion.includes('toit') || lowerQuestion.includes('friday') || lowerQuestion.includes('weekend')) {
        return `Toit on Friday evening? Guru, you better have a backup plan!

The reality:
- 1+ hour wait without reservation
- Parking nightmare in Indiranagar
- Crowd starts building by 6 PM

Smart moves:
- Make a reservation (seriously!)
- Reach by 5:30 PM or after 9:30 PM
- Have a Plan B pub nearby

Alternative: Try Toit on a Tuesday evening. Same beer, half the crowd, and you can actually have a conversation!`;
    }

    // Airport and Travel
    if (lowerQuestion.includes('airport')) {
        return `Airport timing? That's the million-rupee question in Bengaluru!

From city center:
- Normal times: 1 hour buffer
- Peak hours: 1.5-2 hours buffer
- Rain: Add 30 minutes more
- Weekend evenings: Pray to traffic gods

Pro tips:
- KIAL taxi is expensive but reliable
- Ola/Uber might cancel during surge
- Vayu Vajra bus is cheapest but slow
- If you have early morning flight, stay near airport

Don't risk it with just 30 minutes unless it's 2 AM on a Tuesday!`;
    }

    // Auto and Cab behavior
    if (lowerQuestion.includes('auto') || lowerQuestion.includes('meter')) {
        return `Auto meter? Anna, welcome to Bengaluru!

"Meter illa" translation: "Let's negotiate"

Your options:
- Argue (if you have time and energy)
- Walk away (if you're not desperate)
- Pay extra (if you're late for something important)

Night rides = automatic "night charge" (legal or not)

Local wisdom: Pick your battles. Sometimes paying ₹50 extra is better than being 30 minutes late.`;
    }

    // Weather and Planning
    if (lowerQuestion.includes('rain') && !lowerQuestion.includes('delivery')) {
        return `Rain in Bengaluru? Everything changes, guru!

Traffic impact:
- Travel time increases by 30-50%
- Silk Board becomes a lake
- Autos disappear or charge double

Planning tips:
- Leave 30 minutes earlier
- Keep an umbrella (obviously)
- Avoid low-lying areas like Silk Board
- Book cabs in advance (surge pricing is real)

Fun fact: Bengaluru gets more traffic jams during light drizzle than heavy rain. Go figure! 🌧️`;
    }

    // Areas and Routes
    if (lowerQuestion.includes('koramangala') || lowerQuestion.includes('indiranagar')) {
        return `Koramangala to Indiranagar? That's a classic Bengaluru route!

Best options:
- Normal times: 20-25 minutes via Intermediate Ring Road
- Peak hours: 45 minutes to 1 hour (no joke)
- Metro: Take Purple Line, but add walking time

Pro tip: Avoid Hosur Road during peak hours. Take the inner roads via Ejipura - it's longer but faster during traffic.

Weekend evenings: Just order in and Netflix. Trust me on this one! 😄`;
    }

    if (lowerQuestion.includes('electronic city') || lowerQuestion.includes('meeting')) {
        return `Electronic City meeting? Plan like you're going to another city!

Timing from city center:
- Normal: 45 minutes
- Peak hours: 1.5 hours minimum
- Rain: Add 30 minutes

Smart moves:
- Leave by 7:30 AM for 9 AM meeting
- Take Hosur Road (avoid Bannerghatta Road)
- Keep client's number handy for "traffic delay" calls

Reality check: Half of Bengaluru works in Electronic City, so you're not alone in this struggle! 🚗`;
    }

    // Generic but contextual response
    if (lowerQuestion.includes('should i') || lowerQuestion.includes('is it safe') || lowerQuestion.includes('how long')) {
        return `${question.charAt(0).toUpperCase() + question.slice(1)}? 

As a Bengaluru local, here's my take: I need a bit more context to give you proper advice!

Tell me:
- What time are you planning this?
- Which area/route are you considering?
- Is this during weekday or weekend?

For example:
- "Should I take ORR to Whitefield at 7 PM?" (I'll tell you it's a bad idea)
- "Is it safe to eat at that CTR in Malleshwaram?" (I'll say go for it!)
- "How long to reach Brigade Road from Koramangala on Sunday?" (I'll give you realistic timing)

The more specific you are, the better local wisdom I can share!`;
    }

    // Final fallback
    return `I hear you asking about "${question}"

As a Bengaluru local, here's my take: This needs some context about traffic, timing, or area to give you a proper answer.

Try asking something like:
- "Should I take ORR or Sarjapur Road at 7 PM?"
- "Is it safe to eat at that roadside stall near my office?"
- "How early should I leave for a 9 AM meeting in Electronic City?"
- "Is the metro better than Uber during peak hours?"

The more specific you are, the better local advice I can give you!`;
}

/**
 * Helper function to set example questions
 */
function setExample(exampleText) {
    document.getElementById("input").value = exampleText;
}

// Make functions available globally for HTML onclick handlers
window.ask = ask;
window.setExample = setExample;