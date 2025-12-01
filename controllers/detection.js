const OpenAI = require('openai');

/**
 * @Description  detect teeth disease using GPT-4 Vision API
 * @Route POST /api/detection/teeth-detection
 * @Access Private
 */
module.exports.teathDetection = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image file"
            });
        }

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "OpenAI API key not configured"
            });
        }

        // Initialize OpenAI client (lazy initialization)
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // Use image buffer directly from multer memory storage
        const imageBuffer = req.file.buffer;
        const base64Image = imageBuffer.toString('base64');
        const mimeType = req.file.mimetype;

        // Create the prompt for teeth disease detection
        const prompt = `You are a dental expert. Analyze this dental image thoroughly and provide a comprehensive assessment. 
Look at the teeth, gums, and overall oral health condition. 
Identify specific dental diseases and conditions visible in the image.

Return your analysis in this JSON format:
{
  "teeth_health_level": {
    "score": "1-10 scale where 10 is perfect health",
    "grade": "Excellent/Good/Fair/Poor/Critical",
    "summary": "brief overall health status"
  },
  "urgency": {
    "level": "Low/Medium/High/Emergency",
    "reason": "detailed explanation for urgency rating",
    "timeline": "how soon treatment should begin"
  },
  "image_quality": "description of image clarity and visibility",
  "teeth_condition": "detailed observations about tooth structure, enamel, cavities",
  "gum_condition": "detailed observations about gum health, color, swelling", 
  "identified_diseases": [
    {
      "disease_name": "specific dental disease or condition name",
      "severity": "Mild/Moderate/Severe",
      "description": "detailed description of the condition",
      "affected_areas": "which teeth or areas are affected"
    }
  ],
  "decay_analysis": {
    "present": "yes/no",
    "type": "surface/deep/root decay",
    "severity": "early/moderate/advanced",
    "description": "detailed decay assessment"
  },
  "discoloration": {
    "present": "yes/no",
    "type": "intrinsic/extrinsic staining",
    "causes": "likely causes of discoloration",
    "description": "detailed color analysis"
  },
  "plaque_tartar": {
    "plaque_present": "yes/no",
    "tartar_present": "yes/no",
    "severity": "light/moderate/heavy",
    "distribution": "location of buildup"
  },
  "treatment_plan": {
    "immediate_treatments": ["list of urgent treatments needed"],
    "recommended_procedures": ["list of dental procedures recommended"],
    "medications": ["any medications that might help"],
    "home_care": ["specific home care instructions"]
  },
  "prevention_tips": [
    "specific prevention advice based on conditions found"
  ],
  "prognosis": "expected outcome with proper treatment",
  "estimated_cost_range": "rough estimate of treatment costs",
  "overall_assessment": "comprehensive summary of oral health status"
}`;

        // Call GPT-4 Vision API with forced JSON response
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 2000,
            temperature: 0.1
        });

        // Direct JSON object from GPT
        const analysis = JSON.parse(response.choices[0].message.content);

        // Return the analysis
        res.status(200).json({
            success: true,
            message: "Teeth analysis completed successfully",
            data: {
                analysis,
                timestamp: new Date().toISOString(),
                model_used: "gpt-4o"
            }
        });

    } catch (error) {
        console.error('Teeth detection error:', error);

        // Handle specific OpenAI API errors
        if (error.code === 'insufficient_quota') {
            return res.status(402).json({
                success: false,
                message: "OpenAI API quota exceeded. Please check your billing."
            });
        }

        if (error.code === 'invalid_api_key') {
            return res.status(401).json({
                success: false,
                message: "Invalid OpenAI API key"
            });
        }

        res.status(500).json({
            success: false,
            message: "Error analyzing teeth image",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

