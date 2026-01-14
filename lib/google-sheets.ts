/**
 * Google Sheets Integration via Apps Script Web App
 * 
 * This module provides functions to log data to Google Sheets
 * using a deployed Apps Script web app endpoint.
 */

interface PromptLogData {
  type: 'prompt';
  userInstructions: string;
  selectedFeatures: string[];
  generatedPrompt: string;
  clientIp: string;
}

interface EmailLogData {
  type: 'email';
  email: string;
}

/**
 * Sends data to Google Sheets via Apps Script webhook
 * Uses fire-and-forget pattern to avoid blocking the response
 */
async function sendToGoogleSheets(data: PromptLogData | EmailLogData): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  // Skip if webhook URL is not configured
  if (!webhookUrl) {
    console.warn('⚠️ GOOGLE_SHEETS_WEBHOOK_URL not configured. Skipping Google Sheets logging.');
    return;
  }

  console.log('📊 Attempting to log to Google Sheets:', {
    type: data.type,
    url: webhookUrl,
  });

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Google Sheets API error:', {
        status: response.status,
        statusText: response.statusText,
        body: text,
      });
    } else {
      console.log('✅ Successfully logged to Google Sheets:', data.type);
    }
  } catch (error) {
    // Log errors but don't throw - this should never break the main flow
    console.error('❌ Failed to log to Google Sheets:', error);
  }
}

/**
 * Logs a prompt generation event to the UserData sheet
 */
export async function logPromptGeneration(
  userInstructions: string,
  selectedFeatures: string[],
  generatedPrompt: string,
  clientIp: string
): Promise<void> {
  const data: PromptLogData = {
    type: 'prompt',
    userInstructions,
    selectedFeatures,
    generatedPrompt,
    clientIp,
  };

  await sendToGoogleSheets(data);
}

/**
 * Logs an email access request to the Emails sheet
 */
export async function logEmailRequest(
  email: string
): Promise<void> {
  const data: EmailLogData = {
    type: 'email',
    email,
  };

  await sendToGoogleSheets(data);
}

