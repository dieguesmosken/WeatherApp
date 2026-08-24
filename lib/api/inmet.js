export async function fetchInmetData() {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const res = await fetch(`https://apitempo.inmet.gov.br/condicao/capitais/${dateStr}`);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json) && json.length > 0) {
        return json;
      } else if (json && Object.keys(json).length > 0 && !Array.isArray(json)) {
        return Object.values(json);
      }
    }

    // Try yesterday if today fails or returns empty
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const yDateStr = `${yYear}-${yMonth}-${yDay}`;

    const yRes = await fetch(`https://apitempo.inmet.gov.br/condicao/capitais/${yDateStr}`);
    if (yRes.ok) {
      const yJson = await yRes.json();
      if (Array.isArray(yJson) && yJson.length > 0) {
        return yJson;
      } else if (yJson && Object.keys(yJson).length > 0 && !Array.isArray(yJson)) {
        return Object.values(yJson);
      }
    }

    throw new Error("No data available for today or yesterday");
  } catch (e) {
    console.error("Failed to fetch INMET data", e);
    throw e;
  }
}
