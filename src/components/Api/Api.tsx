import env from "@/env";

const fetchJSON = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const formatURL = (url: string) => {
  return env.api_url + url;
};

export const GET = async (url: string) => {
  try {
    return await fetchJSON(formatURL(url));
  } catch (error) {
    console.error("GET request error:", error);
  }
};

export const POST = async (url: string, body: any) => {
  try {
    return await fetchJSON(formatURL(url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("POST request error:", error);
  }
};

export const PUT = async (url: string, body: any) => {
  try {
    return await fetchJSON(formatURL(url), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("PUT request error:", error);
  }
};

export const DELETE = async (url: string) => {
  try {
    return await fetchJSON(formatURL(url), {
      method: "DELETE",
    });
  } catch (error) {
    console.error("DELETE request error:", error);
  }
};
