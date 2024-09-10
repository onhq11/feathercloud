import { getTableConfigFillable } from "@/utils/dbUtils";

export type Response = (typeof response)[keyof typeof response];

export const buildResponse = (response: Response, data?: any) => {
  return new Response(
    JSON.stringify(data ? { ...response, data: data } : response),
    {
      headers: { "Content-Type": "application/json" },
      status: response.status,
    },
  );
};

export const response = {
  500: {
    message: "Internal server error",
    status: 500,
  },
  404: {
    message: "Content not found",
    status: 404,
  },
  400: {
    message: "Bad request",
    status: 400,
  },
  201: {
    message: "Successfully created",
    status: 201,
  },
  200: {
    message: "OK",
    status: 200,
  },
};

export interface ApiProps {
  params: { id: string };
}

export const validateFields = (table: string, data: any) => {
  const tableConfig = getTableConfigFillable(table);

  for (const field of tableConfig) {
    const { name, type } = field;

    if (type.split(" | ").some((type: string) => type === "null")) {
      continue;
    }

    if (data[name] == null) {
      return false;
    }

    if (typeof data[name] !== type) {
      return false;
    }
  }

  return true;
};
