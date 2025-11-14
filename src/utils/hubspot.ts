import type { EmailFormData } from '../types';

interface HubSpotContactData {
  properties: {
    email: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    [key: string]: string | undefined;
  };
}

export async function submitToHubSpot(data: EmailFormData): Promise<boolean> {
  const accessToken = import.meta.env.VITE_HUBSPOT_ACCESS_TOKEN;
  const portalId = import.meta.env.VITE_HUBSPOT_PORTAL_ID;

  // If no credentials, just log and return success (for development)
  if (!accessToken || !portalId) {
    console.warn('HubSpot credentials not configured, skipping submission');
    return true;
  }

  try {
    const contactData: HubSpotContactData = {
      properties: {
        email: data.email,
        firstname: data.firstName,
        lastname: data.lastName,
        company: data.company,
      },
    };

    const response = await fetch(
      `https://api.hubapi.com/crm/v3/objects/contacts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(contactData),
      }
    );

    if (!response.ok) {
      // Check if contact already exists (409 conflict)
      if (response.status === 409) {
        console.log('Contact already exists in HubSpot');
        return true;
      }
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error submitting to HubSpot:', error);
    // Don't block the user flow if HubSpot fails
    return true;
  }
}

